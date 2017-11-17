/**
 * Created by abdelmon on 9/5/2017.
 */
import
React, {
    Component
}
    from
    'react';
import {
    AppRegistry,
    StyleSheet,
    Text,BackHandler,
    View,
    TouchableOpacity, Switch, AsyncStorage, Dimensions
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
    Form,
    Item,
    Input,
    Icon,
    Title,
    StyleProvider, List, ListItem, Card, CardItem,
} from 'native-base';
import axios from 'axios'
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

export default class CycleMembers extends Component {


    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            progressVisible: false,
            renderedMembers: [],
            currentCycleId: "",
            RATEDUSERID: "",
            profileResponse: {},
            showData: false,
            remindersFlag: false,
            arrayOfReminders: [],
            ReceiverId: "",
            message: ""

        }

        this.handleBackButton = this.handleBackButton.bind(this);
        

        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        this.flag = false;

        this.currentUserId = this.props.navigation.state.params.userid;
    }

    componentDidMount() {

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    
    componentWillUnmount() {
    
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);

    }

    
    handleBackButton() {
        let component = this;
        const { navigate } = component.props.navigation;
        navigate("MyCycles", { userid: this.props.navigation.state.params.userid });
    }

    componentWillMount() {

        let renderedMembers = []
        axios({
            method: "POST",
            url: "http://www.gameya.somee.com/api/gamieya/GetCycleMembers",
            data: JSON.stringify({
                User_id: this.props.navigation.state.params.userid,
                Cycle_id: this.props.navigation.state.params.cycleid.id
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ progressVisible: false });
                console.log(resp)
                if (resp.data.users.length > 0) {
                    for (let x = 0; x < resp.data.users.length; x++) {
                        renderedMembers.push(
                            <ListItem style={{ height: 100 }} icon key={x} onPress={() => {
                                this.showUserProfile(resp.data.users[x].id, this.props.navigation.state.params.cycleid.id);

                            }}>
                                <Left style={{ height: 100 }}>
                                    <Icon name="md-contact" />
                                </Left>
                                <Body style={{ height: 100 }}>
                                    <Text>Name : {resp.data.users[x].full_name}</Text>
                                    <Text>Reserved Month : {this.monthNames[resp.data.months[x].cyclE_MONTH - 1]}</Text>
                                    {resp.data.months[x].status == "requested" ? <Button onPress={() => {
                                        this.confirmRequest(resp.data.months[x].cyclE_ID, resp.data.months[x].useR_JOINED_ID);
                                    }} style={{ borderRadius: 10, backgroundColor: "#262261" }}>
                                        <Text style={{ color: "white" }}>Confirm</Text>
                                    </Button> : <Text>status : Confirmed</Text>}

                                </Body>
                                <Right style={{ height: 100 }}>
                                    <Text>show</Text>
                                    <Icon name="arrow-forward" />
                                </Right>

                            </ListItem>
                        )
                    }
                    this.setState({ renderedMembers: renderedMembers }, () => {
                        // this.refs.ModalMembers.open();
                    })
                }

            })
            .catch((err) => {

                this.setState({ progressVisible: false }, () => {
                    alert("Unexpected error");
                });

            })
    }

    renrederMembers() {

        let renderedMembers = []
        axios({
            method: "POST",
            url: "http://www.gameya.somee.com/api/gamieya/GetCycleMembers",
            data: JSON.stringify({
                User_id: this.props.navigation.state.params.userid,
                Cycle_id: this.props.navigation.state.params.cycleid.id
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                console.log(resp)
                if (resp.data.users.length > 0) {
                    debugger;
                    for (let x = 0; x < resp.data.users.length; x++) {
                        renderedMembers.push(
                            <ListItem style={{ height: 90 }} icon key={x} onPress={() => {
                                this.showUserProfile(resp.data.users[x].id, this.props.navigation.state.params.cycleid.id);

                            }}>
                                <Left style={{ height: 90 }}>
                                    <Icon name="md-contact" />
                                </Left>
                                <Body style={{ height: 90 }}>
                                    <Text>Name : {resp.data.users[x].full_name}</Text>
                                    <Text>Reserved Month : {this.monthNames[resp.data.months[x].cyclE_MONTH - 1]}</Text>
                                    {resp.data.months[x].status == "requested" ? <Button onPress={() => {
                                        this.confirmRequest(resp.data.months[x].cyclE_ID, resp.data.months[x].useR_JOINED_ID);
                                    }} style={{ borderRadius: 10, backgroundColor: "#262261" }}>
                                        <Text style={{ color: "white" }}>Confirm</Text>
                                    </Button> : <Text>status : Confirmed</Text>}

                                </Body>
                                <Right style={{ height: 90 }}>
                                    <Text>show</Text>
                                    <Icon name="arrow-forward" />
                                </Right>

                            </ListItem>
                        )
                    }
                    this.setState({ renderedMembers: renderedMembers }, () => {
                        // this.refs.ModalMembers.open();
                    })
                }

            })
            .catch((err) => {
                alert("Unexpected error");

            })
    }

    confirmRequest(cycleid, userid) {

        axios({
            method: "POST",
            url: "http://www.gameya.somee.com/api/gamieya/AdminConfirmRequests",
            data: JSON.stringify({ User_id: userid, Cycle_id: cycleid }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ progressVisible: false });
                if (resp.data.message = "confirmed") {
                    alert("This user has been Confirmed");
                    this.renrederMembers();
                }

            })
            .catch((err) => {
                this.setState({ progressVisible: false });
                alert("Unexpected error");

            })
    }

    showUserProfile = (userid, cycleid) => {
        let renderedProfile = []
        this.setState({ currentCycleId: cycleid, RATEDUSERID: userid })
        let userData = {
            id: userid
        }

        this.setState({ visible: true })

        axios({
            method: "POST",
            url: "http://www.gameya.somee.com/api/gamieya/GetUserProfile",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ visible: false });
                console.log(resp)
                let response = resp.data;
                this.state.profileResponse = response;
                this.setState({ profileResponse: response }, () => {
                    for (let x = 0; x < response.user.useR_FOLLOWERS.length; x++) {
                        if (response.user.useR_FOLLOWERS[x].follower_id === this.currentUserId && response.user.id === response.user.useR_FOLLOWERS[x].user_id) {
                            this.flag = true;
                        }
                    }

                    this.setState({ showData: true }, () => {
                        this.refs.ModalProfile.open();

                    })
                });
                // this.setState({renderedUserProfile: renderedProfile});

            })
            .catch((err) => {
                alert("Unexpected error");
                this.setState({ visible: false });

            })


    }

    renderProfileData(response) {


        if (this.flag === true) {
            this.flag = false;
            return (
                <View key={0} style={{ borderRadius: 12 }}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>{response.user.full_name}</Text>
                        <StarRating
                            maxStars={5}
                            rating={this.state.starCount}
                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                            starSize={20}
                            emptyStar={'star-o'}
                            fullStar={'star'}
                            halfStar={'star-half'}
                        />
                        <Text>Total user rate : {response.ratesTotal}</Text>
                        <Text>Rate User : {this.state.starCount}</Text>
                        <View>
                            <Text>─────────────────────</Text>
                        </View>
                    </View>

                    <Text>Email : {response.user.email}</Text>
                    <Text>Phone : {response.user.mobile}</Text>
                    <Button style={{ borderRadius: 12, width: "50%", height: "14%", backgroundColor: "#262261" }} onPress={() => {
                        this.setState({ ReceiverId: response.user.id });
                        this.handleSendPrivateMsg();
                    }}><Text style={{ color: "white", fontSize: 10 }}>Send a private message</Text></Button>
                </View>
            )
        }
        else {
            return (
                <View key={0} style={{ borderRadius: 12 }}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>{response.user.full_name}</Text>
                        <StarRating
                            maxStars={5}
                            rating={this.state.starCount}
                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                            starSize={20}
                            emptyStar={'star-o'}
                            fullStar={'star'}
                            halfStar={'star-half'}
                        />
                        <Text>Total user rate : {response.ratesTotal}</Text>
                        <Text>Rate User : {this.state.starCount}</Text>
                        <View>
                            <Text>─────────────────────</Text>
                        </View>
                    </View>

                    <Text>Email : {response.user.email}</Text>
                    <Text>Phone : {response.user.mobile}</Text>
                    <Button style={{ borderRadius: 12, width: "50%", height: "14%", backgroundColor: "#262261" }} onPress={() => {
                        this.setState({ ReceiverId: response.user.id });
                        this.handleSendPrivateMsg();
                    }}><Text style={{ color: "white", fontSize: 10 }}>Send a private message</Text></Button>
                </View>
            )
        }

    }

    FollowUser = (profileuserid) => {

        this.setState({ progressVisible: true })
        let userData = {
            Userid: profileuserid,
            Followerid: this.currentUserId
        }

        axios({
            method: "POST",
            url: "http://www.gameya.somee.com/api/gamieya/FollowUser",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ progressVisible: false });
                console.log(resp)
                alert("followed successfully")

            })
            .catch((err) => {
                alert("Unexpected error");
                this.setState({ progressVisible: false });

            })

    }

    onStarRatingPress = (rate) => {

        this.setState({ starCount: rate });
        this.setState({ progressVisible: true });


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
                this.setState({ progressVisible: false });

                alert("User Rated Successfully");

                // this.setState({renderedUserProfile: renderedProfile});

            })
            .catch((err) => {
                alert("Unexpected error");
                this.setState({ visible: false });

            })


    }

    UnfollowUser = (profileuserid) => {

        this.setState({ progressVisible: true })
        let userData = {
            Userid: profileuserid,
            Followerid: this.currentUserId
        }

        axios({
            method: "POST",
            url: "http://www.gameya.somee.com/api/gamieya/UnfollowUser",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {

                this.setState({ progressVisible: false });
                console.log(resp)
                this.refs.ModalProfile.close();

            })
            .catch((err) => {
                alert("Unexpected error");
                this.setState({ progressVisible: false });

            })

    }

    handleReminders() {
        this.setState({ progressVisible: true });

        axios({
            method: "POST",
            url: "http://www.gameya.somee.com/api/gamieya/RemoveReminders",
            data: JSON.stringify({ id: this.props.navigation.state.params.cycleid.id }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ progressVisible: false });
                if (resp.data.status == "There is no reminders for this cycle") {
                    this.setState({ remindersFlag: false }, () => {
                        this.refs.ModalReminder.open();
                    })
                }
                else {
                    this.setState({ remindersFlag: true }, () => {
                        this.refs.ModalReminder.open();

                    })

                }

            })
            .catch((err) => {
                this.setState({ progressVisible: false });
                alert("Unexpected error");

            })


    }


    handleSaveReminders = () => {
        if (this.state.remindersFlag === true) {
            this.state.arrayOfReminders = [];
            let promisesToBeResloved = [];
            var dateStart = moment(moment(this.props.navigation.state.params.cycleid.startDate).format("YYYY-MM-DD"));
            var dateEnd = moment(moment(this.props.navigation.state.params.cycleid.endDate).format("YYYY-MM-DD"));
            var timeValues = [];
            let deferedListOfEvents = [];

            while (dateEnd > dateStart) {

                deferedListOfEvents.push(RNCalendarEvents.saveEvent('gameiya : ' + this.props.navigation.state.params.cycleid.cyclE_NAME, {
                    calendarId: "1",
                    location: 'location',
                    notes: 'pay : ' + this.props.navigation.state.params.cycleid.totaL_AMOUNT,
                    startDate: dateStart.format("YYYY-MM-DD").toString() + "T14:00:00.000Z",
                    endDate: dateStart.format("YYYY-MM-DD").toString() + "T14:00:00.000Z"
                })
                )
                console.log(dateStart.format("YYYY-MM-DD").toString() + "T14:00:00.000Z");
                timeValues.push(dateStart);
                dateStart.add(1, "months")


            }

            axios.all(deferedListOfEvents).then((results) => {
                results.forEach((response, i) => {
                    this.state.arrayOfReminders.push({
                        "cycle_id": this.props.navigation.state.params.cycleid.id,
                        "user_id": this.props.navigation.state.params.userid,
                        "calendar_reminder_id": response,
                        "date": timeValues[i].format("YYYY-MM-DD").toString() + "T14:00:00.000Z"
                    })

                    if (response === results[results.length - 1]) {
                        axios({
                            method: "POST",
                            url: "http://www.gameya.somee.com/api/gamieya/AddReminders",
                            data: JSON.stringify(this.state.arrayOfReminders),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                            .then((resp) => {
                                this.setState({ progressVisible: false });
                                alert("reminders created successfully")

                            })
                            .catch((err) => {
                                this.setState({ progressVisible: false });
                                alert("Unexpected error");

                            })

                    }


                })
            })


        }
        else {

            let defferedRemoveEvents = [];
            //   remove reminders
            axios({
                method: "POST",
                url: "http://www.gameya.somee.com/api/gamieya/RemoveReminders",
                data: JSON.stringify({ id: this.props.navigation.state.params.cycleid.id }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((resp) => {
                    this.setState({ progressVisible: false });
                    let finalData = resp.data;
                    if (finalData.reminders) {

                        for (let x = 0; x < finalData.reminders.length; x++) {
                            debugger;
                            defferedRemoveEvents.push(RNCalendarEvents.removeEvent(finalData.reminders[x].calendar_reminder_id.toString()))

                        }
                        axios.all(defferedRemoveEvents).then((result) => {
                            debugger;
                            result.forEach((v, i) => {

                            })
                        })

                        alert("reminders removed successfully")

                    }
                    else {
                        alert("there's no reminders")
                    }

                })
                .catch((err) => {
                    this.setState({ progressVisible: false });
                    alert("Unexpected error");

                })

        }

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
                        alert("message has been sent")
                        let status = resp.data.status;

                        this.setState({ message: "" })


                    })
                    .catch((err) => {
                        alert("Unexpected error");

                    })
            }

            else {
                alert("enter message")
            }
        });


    }


    render() {
        const { navigate } = this.props.navigation;
        let cycleInfo = this.props.navigation.state.params.cycleid;
        let shareOptions = {
            title: "ElGameya app",
            message: "i would like to invite you to join cycle : " + cycleInfo.cyclE_NAME + " and pay : " + cycleInfo.totaL_AMOUNT + " -- download the app from store",
            url: "https://play.google.com/store",
            subject: "ElGameya app" //  for email
        };
        return (
            <Container>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

                <PopupDialog width={width - 100} height={150}
                    dialogTitle={<DialogTitle title="send private message" />}
                    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                >
                    <View>
                        <Input style={{ borderColor: "black", fontSize: 14, width: "100%", backgroundColor: "white", borderRadius: 10 }} value={this.state.message}
                            onChangeText={(text) => {
                                this.setState({ message: text })
                            }} placeholder="enter message"
                        />
                        <Button style={{ borderRadius: 12, width: "25%", height: "30%", backgroundColor: "#262261" }} onPress={() => {
                            this.sendMessage();
                        }}><Text style={{ color: "white", fontSize: 10 }}>Send</Text></Button>
                    </View>
                </PopupDialog>

                <Modal backButtonClose={true}   style={[styles.modal, styles.modalProfile]} position={"center"} ref={"ModalProfile"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Content>
                            {this.state.showData ? this.renderProfileData(this.state.profileResponse) : null}
                        </Content>
                    </Container>

                </Modal>

                <Modal backButtonClose={true}   style={[styles.modal, styles.modalReminder, { zIndex: 10, position: "absolute" }]} position={"center"} ref={"ModalReminder"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Content>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 0.1 }}>
                                    <Icon name="md-alarm" /></View>
                                <View style={{ flex: 0.5 }}>
                                    <Text>calendar reminders & alarms</Text>
                                </View>
                                <View style={{ flex: 0.1 }}></View>
                                <View style={{ flex: 0.3 }}>
                                    <Switch onValueChange={(val) => {
                                        this.setState({ remindersFlag: !this.state.remindersFlag })
                                    }} value={this.state.remindersFlag} /></View>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", marginLeft: 10, marginTop: 10 }}>
                                <View style={{ flex: 0.3 }}>
                                    <Button style={{ borderRadius: 10, backgroundColor: "#262261" }} onPress={() => {
                                        this.refs.ModalReminder.close();
                                    }}><Text style={{ color: "white" }}>cancel</Text></Button>
                                </View>
                                <View style={{ flex: 0.4 }}></View>
                                <View style={{ flex: 0.3 }}>
                                    <Button style={{ borderRadius: 10, backgroundColor: "#262261" }} onPress={() => {
                                        this.handleSaveReminders()
                                    }}><Text style={{ color: "white" }}>save</Text></Button></View>
                            </View>
                        </Content>
                    </Container>
                </Modal>

                <Content>
                    <Header style={{ backgroundColor: "#9E1F64" }}>
                        <Left>
                            <Button transparent onPress={() => {
                                navigate("MyCycles", { userid: this.props.navigation.state.params.userid });

                            }}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>My Cycles</Title>
                        </Body>
                        <Right>
                            <Icon onPress={() => {
                                this.handleReminders();
                            }} name='md-alarm' style={{ color: "white" }} />

                        </Right>
                    </Header>

                    <ProgressDialog
                        visible={this.state.progressVisible}
                        title="My Cycles"
                        message="Please, wait..."
                    />


                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{ marginLeft: 20, marginTop: 12, marginBottom: 12 }}>
                            <Thumbnail source={{ uri: 'https://d30y9cdsu7xlg0.cloudfront.net/png/4195-200.png' }} />
                        </View>

                        <View style={{ marginLeft: 20, marginTop: 23 }}>
                            <Text style={{ fontSize: 18 }}>cycle
                                : {this.props.navigation.state.params.cycleid.cyclE_NAME}</Text>
                            <Text style={{ fontSize: 16 }}>number of memebers
                                : {this.props.navigation.state.params.cycleid.numbeR_OF_MEMBERS}</Text>
                        </View>

                    </View>

                    <View
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: 'black',
                            width: 400,
                        }}
                    />

                    <Grid>
                        <Row>
                            <Col></Col>
                            <Col></Col>
                            <Col>
                                <View style={{ alignItems: "center" }}>
                                    <Icon name="md-add-circle" onPress={() => {
                                        Share.open(shareOptions);
                                    }} />
                                    <Text>Add Members</Text>
                                </View>
                            </Col>
                        </Row>
                    </Grid>

                    <List>
                        {this.state.renderedMembers}
                    </List>


                </Content>
            </Container>
        );
    }


}


const styles = StyleSheet.create({

    wrapper: {},

    modal: {
        /* justifyContent: 'center',
         alignItems: 'center'*/
        backgroundColor: "#E6E6E6",
        padding: 10
    },
    modalReminder: {
        height: "22%",
        width: "85%",
        borderRadius: 12
    },


    modal3: {
        height: "85%",
        width: "85%"
    },
    modalProfile: {
        height: "35%",
        width: "85%"
    },

    textBorder: {
        borderColor: 'black',
        borderWidth: 1
    }

});