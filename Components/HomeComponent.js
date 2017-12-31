/**
 * Created by abdelmon on 8/4/2017.
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
    Text,
    View,
    TouchableOpacity, Switch, AsyncStorage, Dimensions, BackHandler,
    Image
} from 'react-native';
import { Button } from 'native-base';
import {
    Container,
    Content,
    Header,
    Left,
    Body, Badge,
    Grid,
    Col, CheckBox,
    Row,
    Right,
    Form,
    Item,
    Input,
    Icon,
    Thumbnail,
    Title,
    StyleProvider, List, ListItem, Card, CardItem,
} from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import StarRating from 'react-native-star-rating';
import RNCalendarEvents from 'react-native-calendar-events';
import axios from 'axios'
import PageOne from './LoginComponent'
import Modal from 'react-native-modalbox';
var moment = require('moment');
import Spinner from 'react-native-loading-spinner-overlay';
import Share, { ShareSheet } from 'react-native-share';
import Toast, { DURATION } from 'react-native-easy-toast'
import { ProgressDialog } from 'react-native-simple-dialogs';

export default class HomeComponent extends Component {

    static navigationOptions = {
        title: "ElGameya",
        header: null,
        drawerLabel: 'Profile',
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="person" style={{ color: "white" }} />
        ),
    }


    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isDisabled: false,
            isDateTimePickerVisible: false,
            selectedStartDate: "",
            selectedEndDate: "",
            noOfMembers: "",
            cycleTotalAmount: "",
            cycleName: "",
            visible: false,
            cyclePrivacy: false,
            renderedCycles: [],
            amountForSearch: "",
            returnedCycles: [],
            getAll: false,
            renderedMonths: [],
            choosenCycleId: "",
            renderedNotifications: [],
            starCount: 0,
            progressVisible: false,
            username: "",
            remindersFlag: false,
            openedCycle: {},
            renderedRequests: []

        }

        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];


    }


    onCancel() {
        console.log("CANCEL")
        this.setState({ visible: false });
    }

    onOpen() {
        console.log("OPEN")
        this.setState({ visible: true });
    }


    _handleDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        console.log(moment(date).format("YYYY-MM"))
        if (this.state.StartOrEnd === "start") {
            this.setState({ selectedStartDate: moment(date).format("YYYY-MM") })

        }
        else {
            if (this.state.selectedStartDate === "") {
                alert("please enter start month")
            }
            else {
                if (moment(this.state.selectedStartDate) > moment(date) || moment(date).format("YYYY-MM") === this.state.selectedStartDate) {
                    alert("selected end month is before or equal start month");
                }
                else {
                    this.setState({ selectedEndDate: moment(date).format("YYYY-MM") }, () => {
                        var dateStart = moment(this.state.selectedStartDate);
                        var dateEnd = moment(this.state.selectedEndDate);

                        var timeValues = [];

                        while (dateEnd > dateStart) {
                            timeValues.push(dateStart.format('YYYY-MM'));
                            dateStart.add(1, 'month');
                        }

                        this.setState({ noOfMembers: (timeValues.length + 1).toString() })

                    })

                }

            }

        }
        this._hideDateTimePicker();
    };

    handleCancel = () => {
        this.refs.modal3.close();
    }


    openCyclesModal = () => {

        let renderedListOfCycles = [];

        if (this.state.returnedCycles.length > 0) {
            for (let x = 0; x < this.state.returnedCycles.length; x++) {
                renderedListOfCycles.push(
                    <Card key={x}>
                        <CardItem header>
                            <Text>{this.state.returnedCycles[x].cyclE_NAME}</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>
                                    StartDate : {this.state.returnedCycles[x].startDate}
                                </Text>
                                <Text>EndDate : {this.state.returnedCycles[x].endDate}</Text>
                                <Text>Number of members : {this.state.returnedCycles[x].numbeR_OF_MEMBERS}</Text>
                                <View style={{ height: "10%", marginLeft: 5, justifyContent: "center", marginTop: 5, alignItems: "center", flex: 1, marginBottom: 5 }}>
                                    <View style={{ width: "50%" }}>
                                        <Button block onPress={() => {
                                            this.getCycleMonths(this.state.returnedCycles[x])
                                        }}>
                                            <Text style={{ fontSize: 12, color: "white" }}>get cycle months</Text>
                                        </Button>
                                    </View>
                                </View>
                            </Body>
                        </CardItem>
                        <CardItem footer>
                            <Text>Amount : {this.state.returnedCycles[x].totaL_AMOUNT}</Text>
                        </CardItem>
                    </Card>
                )
            }


            this.setState({ renderedCycles: renderedListOfCycles })

        }

    }


    getUserProfile = (userid) => {
        let renderedProfile = [];

        this.setState({ RATEDUSERID: userid })
        let userData = {
            id: userid
        }

        this.setState({ visible: true })

        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetUserProfile",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ visible: false });
                console.log(resp)
                let response = resp.data;
                renderedProfile.push(<Card key={0}>
                    <CardItem>
                        <Body>
                            <Text>Name : {response.user.full_name}</Text>
                            <Text>Email : {response.user.email}</Text>
                            <Text>Phone : {response.user.mobile}</Text>
                            <Text>Total rate : {response.ratesTotal}</Text>

                            <Text>Rate User : {this.state.starCount}</Text>
                            <StarRating
                                maxStars={5}
                                rating={this.state.starCount}
                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                                starSize={30}
                                emptyStar={'star-o'}
                                fullStar={'star'}
                                halfStar={'star-half'}
                            />
                        </Body>
                    </CardItem>
                </Card>);

                this.refs.modalMonths.close();

                this.setState({ profileResponse: response }, () => {
                    this.setState({ showData: true })
                    this.refs.ModalProfile.open();

                });


                // this.setState({renderedUserProfile: renderedProfile});

            })
            .catch((err) => {
                this.setState({ visible: false }, () => {
                    alert("Unexpected error");

                });

            })
    }


    renderProfileData(response) {
        return (
            <Card key={0}>

                <CardItem>
                    <Body>
                        <Text>Name : {response.user.full_name}</Text>
                        <Text>Email : {response.user.email}</Text>
                        <Text>Phone : {response.user.mobile}</Text>
                        <Text>Total rate : {response.ratesTotal}</Text>

                        <Text>Rate User : {this.state.starCount}</Text>
                        <StarRating
                            maxStars={5}
                            rating={this.state.starCount}
                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                            starSize={30}
                            emptyStar={'star-o'}
                            fullStar={'star'}
                            halfStar={'star-half'}
                        />

                    </Body>
                </CardItem>

            </Card>
        )
    }


    handleOpenMyCycles = () => {

        this.doGetMyCycles();
    }

    handleReminders(cycle) {
        this.setState({ progressVisible: true, openedCycle: cycle });

        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/RemoveReminders",
            data: JSON.stringify({ id: cycle.id }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ progressVisible: false });
                if (resp.data.status == "There is no reminders for this cycle") {
                    this.setState({ remindersFlag: false }, () => {
                        this.refs.myCycles.close();
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
                this.setState({ progressVisible: false }, () => {
                    alert("Unexpected error");

                });

            })


    }

    handleSaveReminders = () => {
        if (this.state.remindersFlag === true) {
            this.state.arrayOfReminders = [];
            let promisesToBeResloved = [];
            var dateStart = moment(moment(this.state.openedCycle.startDate).format("YYYY-MM-DD"));
            var dateEnd = moment(moment(this.state.openedCycle.endDate).format("YYYY-MM-DD"));
            var timeValues = [];
            let deferedListOfEvents = [];

            while (dateEnd > dateStart) {

                deferedListOfEvents.push(RNCalendarEvents.saveEvent('gameiya : ' + this.state.openedCycle.cyclE_NAME, {
                    calendarId: "1",
                    location: 'location',
                    notes: 'pay : ' + this.state.openedCycle.totaL_AMOUNT,
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
                        "cycle_id": this.state.openedCycle.id,
                        "user_id": this.props.navigation.state.params.id,
                        "calendar_reminder_id": response,
                        "date": timeValues[i].format("YYYY-MM-DD").toString() + "T14:00:00.000Z"
                    })

                    if (response === results[results.length - 1]) {
                        axios({
                            method: "POST",
                            url: "http://www.elgameya.net/api/gamieya/AddReminders",
                            data: JSON.stringify(this.state.arrayOfReminders),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                            .then((resp) => {
                                this.setState({ progressVisible: false }, () => {
                                    alert("reminders created successfully")

                                });

                            })
                            .catch((err) => {
                                this.setState({ progressVisible: false }, () => {
                                    alert("Unexpected error");

                                });

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
                url: "http://www.elgameya.net/api/gamieya/RemoveReminders",
                data: JSON.stringify({ id: this.state.openedCycle.id }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((resp) => {
                    this.setState({ progressVisible: false });
                    let finalData = resp.data;
                    if (finalData.reminders) {

                        for (let x = 0; x < finalData.reminders.length; x++) {
                            defferedRemoveEvents.push(RNCalendarEvents.removeEvent(finalData.reminders[x].calendar_reminder_id.toString()))

                        }
                        axios.all(defferedRemoveEvents).then((result) => {
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




    doGetMyCycles = () => {
        let component = this;
        let renderedData = [];
        let id = component.props.navigation.state.params.id;
        this.setState({ progressVisible: true });


        let userData = {
            id: id
        }

        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetMyCycles",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ progressVisible: false });

                if (resp.data.mycycles.length > 0) {

                    for (let x = 0; x < resp.data.mycycles.length; x++) {
                        renderedData.push(
                            <Card key={x}>
                                <CardItem header>
                                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>cycle : {resp.data.mycycles[x].cyclE_NAME}</Text>
                                    <Right>
                                        <Icon onPress={() => {
                                            this.handleReminders(resp.data.mycycles[x]);
                                        }} name='md-alarm' />

                                    </Right>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Text>
                                            StartDate : {resp.data.mycycles[x].startDate}
                                        </Text>
                                        <Text>EndDate : {resp.data.mycycles[x].endDate}</Text>
                                        <Text>Number of members : {resp.data.mycycles[x].numbeR_OF_MEMBERS}</Text>
                                        <Text>Amount : {resp.data.mycycles[x].totaL_AMOUNT} </Text>
                                    </Body>
                                </CardItem>
                                <CardItem footer>
                                    <Text>Reserved Month : {resp.data.cycles[x].cyclE_MONTH}</Text>
                                </CardItem>
                            </Card>
                        )
                    }

                }
                this.setState({ returnedMyCycles: renderedData })
            })
            .catch((err) => {
                console.log(err)
                this.setState({ progressVisible: false });
                alert("Unexpected error");

            })

    }


    handleShowNotifications = () => {

        this.setState({ progressVisible: true });
        let component = this;

        let renderedNotifications = [];
        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetTopTenNotifications",
            data: JSON.stringify({ Id: component.props.navigation.state.params.id }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {

                let notifications = resp.data.notifications;
                if (notifications.length > 0) {

                    for (let x = 0; x < notifications.length; x++) {
                        renderedNotifications.push(
                            <Card key={x}>

                                <CardItem>
                                    <Body>
                                        <Text>{notifications[x].notificatioN_MSG}</Text>
                                    </Body>
                                </CardItem>
                                <View style={{ height: "10%", marginLeft: 5, justifyContent: "flex-start", marginTop: 5, alignItems: "flex-start", flex: 1, marginBottom: 5 }}>
                                    <View>
                                        <Badge style={{ backgroundColor: "#A4A4A4", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontSize: 12, color: "black" }}>
                                                {notifications[x].notificatioN_DATE}
                                            </Text>
                                        </Badge>
                                    </View>
                                </View>
                            </Card>
                        )

                    }
                    if (renderedNotifications.length === 0) {
                        renderedNotifications.push(
                            <Card key={0}>

                                <CardItem>
                                    <Body>
                                        <Text>There's no Notifications</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        )
                    }

                }
                this.setState({ renderedNotifications: renderedNotifications }, () => {
                    this.setState({ progressVisible: false });
                    this.refs.ModalNotifications.open();

                })
            })
            .catch((err) => {
                this.setState({ progressVisible: false }, () => {
                    alert("Unexpected error");

                });

            })


    }

    onStarRatingPress = (rate) => {

        this.setState({ starCount: rate });

        let RateData = {
            USER_ID_RATED: this.state.RATEDUSERID,
            USER_ID_RATER: this.props.navigation.state.params.id,
            RATE: rate
        }

        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/RateUser",
            data: JSON.stringify(RateData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                alert("User Rated Successfully");

                // this.setState({renderedUserProfile: renderedProfile});

            })
            .catch((err) => {
                this.setState({ visible: false }, () => {
                    alert("Unexpected error");

                });

            })


    }


    componentDidMount() {



        AsyncStorage.getItem('adminId', (err, result) => {
            axios({
                method: "POST",
                url: "http://www.elgameya.net/api/gamieya/GetUserNameById",
                data: JSON.stringify({ id: result }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((resp) => {


                    this.setState({ username: resp.data.username });

                })
                .catch((err) => {
                    alert("Unexpected error");
                })
        })


    }

    handlePendingRequests = () => {
        let renderedRequests = [];
        this.setState({ progressVisible: true });
        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetUserPendingRequests",
            data: JSON.stringify({ Id: this.props.navigation.state.params.id }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {

                this.setState({ progressVisible: false });

                let response = resp.data;
                if (response.cycleNames) {
                    for (let x = 0; x < response.cycleNames.length; x++) {
                        renderedRequests.push(
                            <Card key={x}>
                                <CardItem header>
                                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>cycle : {response.cycleNames[x].cyclE_NAME}</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Text>Start Date : {response.cycleNames[x].startDate}</Text>
                                        <Text>End Date : {response.cycleNames[x].endDate}</Text>
                                        <Text>Reserved Month : {this.monthNames[response.requests[x].cyclE_MONTH - 1]}</Text>
                                        <Text>Status : Pending Request</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        )
                    }
                    this.setState({ renderedRequests: renderedRequests }, () => {
                        this.refs.pendingRequests.open();
                    });
                }
                else {
                    alert("There's no pending requests")

                }

            })
            .catch((err) => {
                this.setState({ progressVisible: false }, () => {
                    alert("Unexpected error");

                });

            })
    }



    render() {

        const { navigate } = this.props.navigation;


        let shareOptions = {
            title: "ElGameya app",
            message: "share it with your friends",
            url: "https://play.google.com/store/apps/details?id=com.myrnapp",
            subject: "ElGameya ap" //  for email
        };


        return (
            <Container>

                <Toast ref="toast"
                    fadeInDuration={750}
                    fadeOutDuration={1500}
                    position='center'
                />


                <ProgressDialog
                    visible={this.state.progressVisible}
                    title="ElGameya"
                    message="Please, wait..."
                />
                <Modal backButtonClose={true} onClosed={() => {
                    this.refs.myCycles.open();

                }} backdropPressToClose={true} style={[styles.modal, styles.modalReminder, { zIndex: 10, position: "absolute" }]} position={"center"} ref={"ModalReminder"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Content>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <View style={{ flex: 0.1 }}>
                                    <Icon name="md-alarm" /></View>
                                <View style={{ flex: 0.5 }}>
                                    <Text>Calendar reminders & alarms</Text>
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
                                    }}><Text style={{ color: "white" }}>Cancel</Text></Button>
                                </View>
                                <View style={{ flex: 0.4 }}></View>
                                <View style={{ flex: 0.3 }}>
                                    <Button style={{ borderRadius: 10, backgroundColor: "#262261" }} onPress={() => {
                                        this.handleSaveReminders()
                                    }}><Text style={{ color: "white" }}>Save</Text></Button></View>
                            </View>
                        </Content>
                    </Container>
                </Modal>


                <Content>
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

                    <Header style={{ backgroundColor: "#9E1F64" }}>
                        <Left>
                            <Icon name="menu" style={{ color: "white" }} onPress={() => {
                                this.props.navigation.navigate('DrawerOpen'); // open drawer
                            }} />
                        </Left>
                        <Body>
                            <Title>Profile</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => {
                                this.handleShowNotifications()
                            }}>
                                <Icon name='md-notifications' style={{ color: "white" }} />
                            </Button>
                        </Right>
                    </Header>
                    <List>
                        <Grid>
                            <Row>
                                <Col style={{ width: "25%" }}>
                                    <View style={{ marginLeft: 20, marginTop: 12, marginBottom: 12 }}>
                                        <Thumbnail source={{ uri: 'https://www.flexygames.net/images/user/user-171302.png' }} />
                                    </View>
                                </Col>
                                <Col style={{ width: "35%" }}>
                                    <View style={{ marginTop: 25, marginBottom: 12 }}>
                                        <Text style={{ fontSize: 18 }}>{this.state.username}</Text>
                                    </View>
                                </Col>
                                <Col style={{ width: "10%" }}></Col>
                                <Col style={{ width: "30%" }}>
                                    <View style={{ marginRight: 20, marginTop: 15, marginBottom: 12 }}>
                                        <Button block
                                            onPress={() => {
                                                const { navigate } = this.props.navigation;
                                                navigate("MyProfile", { userid: this.props.navigation.state.params.id })
                                            }}
                                            style={{ borderRadius: 12, backgroundColor: "#262261", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ color: "white", fontSize: 13 }}>My Profile</Text>
                                        </Button>
                                    </View>
                                </Col>
                            </Row>
                        </Grid>

                        <View
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: 'black',
                                width: 400,
                            }}
                        />
                        <ListItem itemDivider>
                            <Text style={{ fontWeight: "bold" }}>Cycles</Text>
                        </ListItem>
                        <ListItem icon onPress={() => {

                            navigate("MyCycles", { userid: this.props.navigation.state.params.id });

                        }}>
                            <Left>
                                <Image style={{ height: 30, width: 30, alignSelf: "center" }}
                                    source={require('../imgs/mycycles.png')}
                                />
                            </Left>
                            <Body>
                                <Text>My Cycles</Text>
                            </Body>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon onPress={() => {
                            this.refs.myCycles.open();
                        }}>
                            <Left>
                                <Image style={{ height: 30, width: 30, alignSelf: "center" }}
                                    source={require('../imgs/mycycles.png')}
                                />
                            </Left>
                            <Body>
                                <Text>Joined Cycles</Text>
                            </Body>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon onPress={() => {

                            this.handlePendingRequests();

                        }}>
                            <Left>
                                <Image style={{ height: 30, width: 30, alignSelf: "center" }}
                                    source={require('../imgs/mycycles.png')}
                                />
                            </Left>
                            <Body>
                                <Text>My Pending Requests</Text>
                            </Body>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                        <ListItem itemDivider>
                            <Text style={{ fontWeight: "bold" }}>Activity</Text>
                        </ListItem>
                        <ListItem icon onPress={() => {
                            Share.open(shareOptions);
                        }}>
                            <Left>
                                <Image style={{ height: 30, width: 30, alignSelf: "center" }}
                                    source={require('../imgs/invite.png')}
                                />
                            </Left>
                            <Body>
                                <Text>Invite</Text>
                            </Body>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                    </List>


                </Content>


                <Modal backButtonClose={true} style={[styles.modal, styles.modal3]} position={"center"} ref={"modal2"} swipeToClose={false}
                    isDisabled={this.state.isDisabled} onOpened={this.openCyclesModal}>
                    <Container>
                        <Content>
                            {this.state.renderedCycles}
                        </Content>
                    </Container>

                </Modal>



                <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"ModalProfile"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Content>
                            {this.state.showData ? this.renderProfileData(this.state.profileResponse) : null}
                        </Content>
                    </Container>

                </Modal>


                <Modal backButtonClose={true} style={[styles.modal, styles.modal3, { zIndex: 5, position: "absolute" }]} position={"center"} ref={"myCycles"} swipeToClose={false}
                    isDisabled={this.state.isDisabled} onOpened={this.handleOpenMyCycles}>
                    <Container>
                        <Content>
                            {this.state.returnedMyCycles}
                        </Content>
                    </Container>
                </Modal>

                <Modal backButtonClose={true} style={[styles.modal, styles.modal3]} position={"center"} ref={"ModalNotifications"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Header style={{ backgroundColor: "#262261" }}>
                            <Body style={{ alignItems: "center", justifyContent: "center" }}>
                                <Title>Notifications</Title>
                            </Body>
                        </Header>
                        <Content>
                            {this.state.renderedNotifications}
                        </Content>
                    </Container>
                </Modal>

                <Modal backButtonClose={true} style={[styles.modal, styles.modal3]} position={"center"} ref={"pendingRequests"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Header style={{ backgroundColor: "#262261" }}>
                            <Body style={{ alignItems: "center", justifyContent: "center" }}>
                                <Title>Requests</Title>
                            </Body>
                        </Header>
                        <Content>
                            {this.state.renderedRequests}
                        </Content>
                    </Container>
                </Modal>

                <Modal backButtonClose={true}
                    style={[styles.modal, styles.modalInvite]} position={"center"} ref={"inviteModal"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Header style={{ backgroundColor: "#262261" }}>
                            <Body style={{ alignItems: "center", justifyContent: "center" }}>
                                <Title>Invite Friends</Title>
                            </Body>
                        </Header>
                        <Content>
                            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Invite via </Text>
                            <Text style={{ fontSize: 15 }}>Facebook</Text>
                            <Text style={{ fontSize: 15 }}>Gmail</Text>
                            <Text style={{ fontSize: 15 }}>Twitter</Text>
                            <Button rounded style={{ backgroundColor: "#262261" }} block onPress={() => {
                                Share.open(shareOptions);
                            }}><Text style={{ color: "white" }}>Share</Text></Button>
                        </Content>
                    </Container>
                </Modal>


            </Container>


        )
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


    modal3: {
        height: "85%",
        width: "85%",
        borderRadius: 12,

    },

    modalInvite: {
        height: "42%",
        width: "85%",
        borderRadius: 12,
    },


    textBorder: {
        borderColor: 'black',
        borderWidth: 1
    },
    icon: {
        width: 26,
        height: 26,
    },
    modalReminder: {
        height: "22%",
        width: "85%",
        borderRadius: 12
    }

});

