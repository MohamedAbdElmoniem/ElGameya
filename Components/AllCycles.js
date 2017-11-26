import
React, {
    Component
}
    from
    'react';
import {
    AppRegistry,
    StyleSheet,
    Text, BackHandler,
    View,
    TouchableOpacity, Switch, AsyncStorage, Dimensions, Image
} from 'react-native';
import { Button } from 'native-base';
import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Grid,
    Col, CheckBox, Thumbnail,
    Row,
    Right,
    Form, Label,
    Item,
    Input,
    Icon,
    Title,
    StyleProvider, List, ListItem, Card, CardItem,
} from 'native-base';
import axios from 'axios'
import DateTimePicker from 'react-native-modal-datetime-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modalbox';
import StarRating from 'react-native-star-rating';
import Toast, { DURATION } from 'react-native-easy-toast'
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import RNCalendarEvents from 'react-native-calendar-events';
import { ProgressDialog } from 'react-native-simple-dialogs';
var moment = require('moment');
import Share, { ShareSheet } from 'react-native-share';
import PopupDialog, { DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
var { width } = Dimensions.get('window');
var { height } = Dimensions.get('window');
import * as _ from 'lodash';

export default class AllCycles extends Component {
    constructor(props) {
        super(props)
        this.state = {
            renderedCycles: [],
            progressVisible: false,
            choosenCycleId: "",
            renderedMonths: [],
            isDateTimePickerVisible: false,
            selectedStartDate: "",
            CycleName: "",
            Amount: "",
            profileResponse: {},
            ReceiverId: "",
            RATEDUSERID: "",
            showData: false,
        }

        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
    }

    componentWillMount() {
        this.submitSearchCycle();
    }
    submitSearchCycle = () => {
        let component = this;

        let methodtype = "POST";
        let url = "GetCycles"
        let searchData = { id: component.props.navigation.state.params.id }
        this.setState({ progressVisible: true })

        axios({
            method: methodtype,
            url: "http://www.gameya.somee.com/api/gamieya/" + url,
            data: searchData,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ progressVisible: false, returnedCycles: resp.data }, () => {
                    this.renderAllCycles(resp.data)
                    this.setState({ progressVisible: false })
                });
            })
            .catch((err) => {
                this.setState({ progressVisible: false }, () => {
                    alert("Can't get all cycles .. server error");
                });

            })


    }

    renderAllCycles = (returnedCycles) => {

        let renderedListOfCycles = [];
        this.state.renderedCycles = [];
        if (returnedCycles.length > 0) {
            for (let x = 0; x < returnedCycles.length; x++) {
                renderedListOfCycles.push(
                    <Card key={x}>
                        <CardItem header>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Cycle : {returnedCycles[x].cyclE_NAME}</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>Start Date : {returnedCycles[x].startDate}</Text>
                                <Text>EndDate : {returnedCycles[x].endDate}</Text>
                                <Text>Number of members : {returnedCycles[x].numbeR_OF_MEMBERS}</Text>
                                <Text>Amount : {returnedCycles[x].totaL_AMOUNT}</Text>
                            </Body>
                        </CardItem>
                        <CardItem style={{ justifyContent: "center", alignItems: "center" }}>
                            <Button style={{ backgroundColor: "#262261", width: "70%", height: 40, alignItems: "center", justifyContent: "center", borderRadius: 12 }} onPress={() => {
                                this.getCycleMonths(returnedCycles[x])
                            }}>
                                <Text style={{ color: "white" }}>Get cycle months</Text>
                            </Button>
                        </CardItem>
                    </Card>
                )
            }


            this.setState({ renderedCycles: renderedListOfCycles })

        }
        else {
            renderedListOfCycles.push(<Text>There's no cycles</Text>);
            this.setState({ renderedCycles: renderedListOfCycles });
        }
    }
    getCycleMonths = (data) => {
        let component = this;
        let renderedData = [];
        this.setState({ progressVisible: true });


        axios({
            method: "POST",
            url: "http://www.gameya.somee.com/api/gamieya/GetMonthsOfCycle",
            data: JSON.stringify({ id: data.id }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                let MonthsData = resp.data.data;
                let users = resp.data.users;
                component.setState({ choosenCycleId: MonthsData[0].cyclE_ID });
                if (MonthsData.length > 0) {
                    for (let x = 0; x < MonthsData.length; x++) {
                        renderedData.push(
                            <ListItem avatar key={x}>
                                <Body>
                                    <Grid>
                                        {MonthsData[x].reserved == 1 ?
                                            <Row><Col>
                                                <Text>{this.monthNames[MonthsData[x].cyclE_MONTH - 1]}</Text>
                                            </Col>
                                                <Col><Text>Reserved by {users[x].full_name}</Text></Col>
                                                <Col><Button style={{ borderRadius: 10, backgroundColor: "#262261" }} small onPress={() => {
                                                    this.getUserProfile(users[x].id)
                                                }
                                                }><Text style={{ color: "white" }}>Profile</Text></Button></Col>
                                            </Row> :
                                            <Row><Col>
                                                <Text>{this.monthNames[MonthsData[x].cyclE_MONTH - 1]}</Text>
                                            </Col>
                                                <Col></Col>
                                                <Col><Button style={{ borderRadius: 10, backgroundColor: "#262261" }} small onPress={() => {
                                                    this.handleJoinCycle(MonthsData[x].cyclE_MONTH, data.admiN_ID)
                                                }}><Text style={{ color: "white" }}>Join</Text></Button></Col>
                                            </Row>
                                        }
                                    </Grid>
                                </Body>
                            </ListItem>
                        )
                    }

                }
                this.setState({ renderedMonths: renderedData }, () => {
                    component.setState({ progressVisible: false })
                    this.refs.modalMonths.open();
                })
            })
            .catch((err) => {
                console.log(err)
                component.setState({ progressVisible: false }, () => {
                    alert("Unexpected error");
                })

            })
    }

    handleJoinCycle = (month, admiN_ID) => {
        let component = this;
        let choosenCycle = this.state.choosenCycleId;
        let id = component.props.navigation.state.params.userid

        this.setState({ progressVisible: true });
        let data = {
            User_id: id,
            Cycle_id: choosenCycle,
            Month: month
        }

        // join in specific month of cycle
        axios({
            method: "POST",
            url: "http://www.gameya.somee.com/api/gamieya/JoinCycle",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                let responseData = resp.data;

                if (resp.data.status === "success") {

                    component.getCycleMonths({ id: choosenCycle })


                }
                if (resp.data.message) {
                    if (resp.data.message == "already joined this cycle") {
                        this.setState({ progressVisible: false }, () => {
                            alert("You are already a member of this cycle");
                        })

                        // this.refs.toast.show('You are already a member of this cycle');

                    }
                }


            })
            .catch((err) => {
                console.log(err)
                component.setState({ progressVisible: false }, () => {
                    alert("Can't Join the Cycle .. server error");
                })
            })


    }


    getUserProfile = (userid) => {
        let renderedProfile = [];

        this.setState({ RATEDUSERID: userid })
        let userData = {
            id: userid
        }

        this.setState({ progressVisible: true })

        axios({
            method: "POST",
            url: "http://www.gameya.somee.com/api/gamieya/GetUserProfile",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ progressVisible: false });
                console.log(resp)
                let response = resp.data;
                renderedProfile.push(<Grid>
                    <Row>
                        <Col style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 15 }}>{response.user.full_name}</Text>
                            <Text>Total user rate : {response.ratesTotal}</Text>
                            <View>
                                <Text>─────────────────────</Text>
                            </View>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ width: "80%" }}>
                            <Text>Email : {response.user.email}</Text>
                            <Text>Phone : {response.user.mobile}</Text>
                        </Col>
                        <Col style={{ width: "20%" }}></Col>
                    </Row>
                    <Row>
                        <Col style={{ width: "25%" }}></Col>
                        <Col style={{ width: "50%" }}>
                            <Button block style={{ borderRadius: 12, backgroundColor: "#262261", alignItems: "center", justifyContent: "center" }} onPress={() => {
                                this.setState({ ReceiverId: response.user.id });
                                this.handleSendPrivateMsg();
                            }}><Text style={{ color: "white", fontSize: 10 }}>Send a private message</Text></Button>
                        </Col>
                        <Col style={{ width: "25%" }}></Col>
                    </Row>
                </Grid>);

                this.refs.modalMonths.close();

                this.setState({ profileResponse: response }, () => {
                    this.setState({ showData: true })
                    this.refs.ModalProfile.open();

                });


                // this.setState({renderedUserProfile: renderedProfile});

            })
            .catch((err) => {
                this.setState({ progressVisible: false }, () => {
                    alert("Unexpected error");
                });

            })
    }


    renderProfileData(response) {
        return (
            <Grid>
                <Row>
                    <Col style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>{response.user.full_name}</Text>
                        <Text>Total user rate : {response.ratesTotal}</Text>
                        <View>
                            <Text>─────────────────────</Text>
                        </View>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ width: "80%" }}>
                        <Text>Email : {response.user.email}</Text>
                        <Text>Phone : {response.user.mobile}</Text>
                    </Col>
                    <Col style={{ width: "20%" }}></Col>
                </Row>
                <Row>
                    <Col style={{ width: "25%" }}></Col>
                    <Col style={{ width: "50%" }}>
                        <Button block style={{ borderRadius: 12, backgroundColor: "#262261", alignItems: "center", justifyContent: "center" }} onPress={() => {
                            this.setState({ ReceiverId: response.user.id });
                            this.handleSendPrivateMsg();
                        }}><Text style={{ color: "white", fontSize: 10 }}>Send a private message</Text></Button>
                    </Col>
                    <Col style={{ width: "25%" }}></Col>
                </Row>
            </Grid>
        )
    }

    onStarRatingPress = (rate) => {

        this.setState({ starCount: rate });

        let RateData = {
            USER_ID_RATED: this.state.RATEDUSERID,
            USER_ID_RATER: this.props.navigation.state.params.userid,
            RATE: rate
        }

        axios({
            method: "POST",
            url: "http://www.gameya.somee.com/api/gamieya/RateUser",
            data: JSON.stringify(RateData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                console.log(resp)
                alert("User Rated Successfully");

                // this.setState({renderedUserProfile: renderedProfile});

            })
            .catch((err) => {
                this.setState({ visible: false }, () => {
                    alert("Unexpected error");
                });

            })
    }

    handleSendPrivateMsg = () => {
        this.popupDialog.show();
    }

    sendMessage() {


        AsyncStorage.getItem('adminId', (err, result) => {
            this.currentUserId = result;
            let userData = {
                RECEIVER_ID: this.state.ReceiverId,
                SENDER_ID: result,
                MSG: this.state.message
            }

            if (this.state.message != "") {


                axios({
                    method: "POST",
                    url: "http://www.gameya.somee.com/api/gamieya/SendMessage",
                    data: JSON.stringify(userData),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then((resp) => {
                        console.log(resp);
                        alert("Message has been sent")
                        let status = resp.data.status;
                        this.setState({ message: "" })
                    })
                    .catch((err) => {
                        alert("Message not sent");

                    })
            }
            else {
                alert("Please enter message")
            }
        });
    }


    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });


    _handleDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        console.log(moment(date).format("YYYY-MM"))
        this.setState({ selectedStartDate: moment(date).format("YYYY-MM") }, () => {
            this._hideDateTimePicker();
        })
    };

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    handleCyclesFilter = () => {

        let foundedCylces = []
        let SearchFilters = {};
        if (this.state.selectedStartDate != "") {
            SearchFilters.selectedStartDate = (this.state.selectedStartDate);
        }
        if (this.state.CycleName != "") {
            SearchFilters.CycleName = (this.state.CycleName);
        }

        if (this.state.Amount != "") {
            SearchFilters.Amount = (this.state.Amount);
        }
        if (this.state.returnedCycles.length > 0) {

            foundedCylces = _.filter(this.state.returnedCycles, function (cycle) {

                return (SearchFilters.selectedStartDate != undefined ? SearchFilters.selectedStartDate === cycle.startDate : true)
                    && (SearchFilters.CycleName != undefined ? SearchFilters.CycleName === cycle.cyclE_NAME : true)
                    && (SearchFilters.Amount != undefined ? parseInt(SearchFilters.Amount) === cycle.totaL_AMOUNT : true)


            })
            debugger;
            if (foundedCylces.length > 0) {
                this.renderAllCycles(foundedCylces);
            }
            else {
                alert("There's no Cycles Match Your Filters")
            }

        }

        this.setState({ CycleName: "", Amount: "", selectedStartDate: "" })

    }

    render() {

        const { navigate } = this.props.navigation;

        return (

            <Container>
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title="ElGameya"
                    message="Please, wait..."
                />
                <Content>
                    <Header style={{ backgroundColor: "#9E1F64" }}>
                        <Left>
                            <Button transparent onPress={() => {
                                navigate("HomePage", { id: this.props.navigation.state.params.userid });

                            }}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Cycles to Join</Title>
                        </Body>
                    </Header>
                    <View>
                        <Grid style={styles.SearchBox}>
                            <Row>
                                <Col style={{ width: "50%" }}>
                                    <Form>
                                        <Item inlineLabel>
                                            <Input placeholder="Cycle name" value={this.state.CycleName} onChangeText={(text) => {
                                                this.setState({ CycleName: text })
                                            }} />
                                        </Item>
                                    </Form>
                                </Col>
                                <Col style={{ width: "50%" }}>
                                    <Form>
                                        <Item inlineLabel>
                                            <Input placeholder="Amount" value={this.state.Amount} onChangeText={(text) => {
                                                this.setState({ Amount: text })
                                            }} />
                                        </Item>
                                    </Form>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 5, marginBottom: 5 }}>
                                <Col style={{ width: "30%", marginLeft: 10 }}>
                                    <Button style={{ backgroundColor: "#262261", borderRadius: 10 }} onPress={() => {
                                        this._showDateTimePicker()
                                    }}>
                                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ color: "white", fontSize: 12, margin: -5 }}>Start month</Text>
                                        </View>
                                    </Button>
                                </Col>
                                <Col style={{ width: "40%" }}>

                                </Col>
                                <Col style={{ width: "30%" }}>
                                    <Button style={{ backgroundColor: "#9E1F64", borderRadius: 10, width: "80%" }} onPress={
                                        () => {
                                            this.handleCyclesFilter()
                                        }
                                    }>
                                        <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                                            <Text style={{ color: "white", fontSize: 12 }}>Filter</Text>
                                        </View>
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </View>
                    {this.state.renderedCycles}
                </Content>


                <Modal backButtonClose={true} style={[styles.modal, styles.modal3]} position={"center"} ref={"modalMonths"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled} onOpened={this.openMonthsModal}>
                    <Container>
                        <Content>
                            <Header style={{ backgroundColor: "#9E1F64" }}>
                                <Grid>
                                    <Row>
                                        <Col style={{ width: "28%" }}></Col>
                                        <Col style={{ width: "50%" }}><Text style={styles.MonthsHeader}>Cycle Months</Text></Col>
                                        <Col style={{ width: "22%" }}></Col>
                                    </Row>
                                </Grid>
                            </Header>
                            <List>
                                {this.state.renderedMonths}
                            </List>
                        </Content>
                    </Container>

                </Modal>


                <Modal backButtonClose={true} style={[styles.modal, styles.modalProfile]} position={"center"} ref={"ModalProfile"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Content>
                            {this.state.showData ? this.renderProfileData(this.state.profileResponse) : null}
                        </Content>
                    </Container>

                </Modal>

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={(date) => {
                        this._handleDatePicked(date)
                    }}
                    onCancel={this._hideDateTimePicker}
                />
                <PopupDialog width={width - 75} height={140}
                    dialogTitle={<DialogTitle title="send private message" />}
                    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                ><Grid>
                        <Row>
                            <Col style={{ width: "70%", height: "50%" }}>
                                <Input style={{ borderColor: "black", fontSize: 14, backgroundColor: "white", borderWidth: 1, borderRadius: 10 }} value={this.state.message}
                                    onChangeText={(text) => {
                                        this.setState({ message: text })
                                    }} placeholder="enter message"
                                />
                            </Col>
                            <Col style={{ width: "5%" }}></Col>
                            <Col style={{ width: "25%", height: "50%" }}>
                                <Button style={{ borderRadius: 12, backgroundColor: "#262261" }} onPress={() => {
                                    this.sendMessage();
                                }}><Text style={{ color: "white", fontSize: 10 }}>Send</Text></Button></Col>
                        </Row>
                    </Grid>
                </PopupDialog>
            </Container>
        )
    }
}



const styles = StyleSheet.create({
    cycleButton: {
        width: 120,
        height: 120,
        borderRadius: 150 / 2,
        backgroundColor: '#262261',
        marginTop: 12
    },


    textColor: {
        color: "white",
        textAlign: 'center',
        fontSize: 15,
        fontWeight: "bold"
    },

    textColor2: {
        color: "white",
        textAlign: 'center',
        fontSize: 15,
        fontWeight: "bold"
    },
    HollowCircle: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        borderWidth: 2,
        borderColor: '#262261',
        alignItems: 'center',     //<--
        borderStyle: "dotted"
    },

    modal: {
        /* justifyContent: 'center',
         alignItems: 'center'*/
        backgroundColor: "#E6E6E6",
        padding: 10
    },


    modal3: {
        height: "85%",
        width: "85%",
        borderRadius: 12,

    },
    modalCreate: {
        height: "95%",
        width: "85%",
        borderRadius: 12,
    },
    modalJoin: {
        height: "80%",
        width: "85%",
        borderRadius: 12,

    },
    modalProfile: {
        height: "30%",
        width: "85%",
        borderRadius: 12,
    },
    MonthsHeader: {
        color: "white",
        fontSize: 20,
        marginTop: 10
    },
    SearchBox: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#262261',
        marginTop: 5,
        marginBottom: 5,
        marginRight: 10,
        marginLeft: 10
    }
});
