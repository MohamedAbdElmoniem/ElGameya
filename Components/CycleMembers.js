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
    Form,
    Item,
    Input,
    Icon, Tab, Tabs,
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
import TabView from 'mkp-react-native-tab-view';

import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-popup-menu';
var moment = require('moment')
import SortableList from 'react-native-sortable-list';

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
            message: "",
            noMembers: true,
            renderedRequestsList: []

        }

        this.handleBackButton = this.handleBackButton.bind(this);
        this.getUnConfirmedRequests = this.getUnConfirmedRequests.bind(this);
        this.handleDeleteMyCycle = this.handleDeleteMyCycle.bind(this);


        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        this.ListData = {
            0: {
                image: 'https://placekitten.com/200/240',
                text: 'Chloe',
            },
            1: {
                image: 'https://placekitten.com/200/201',
                text: 'Jasper',
            },
            2: {
                image: 'https://placekitten.com/200/202',
                text: 'Pepper',
            },
            3: {
                image: 'https://placekitten.com/200/203',
                text: 'Oscar',
            },
            4: {
                image: 'https://placekitten.com/200/204',
                text: 'Dusty',
            },
            5: {
                image: 'https://placekitten.com/200/205',
                text: 'Spooky',
            },
            6: {
                image: 'https://placekitten.com/200/210',
                text: 'Kiki',
            },
            7: {
                image: 'https://placekitten.com/200/215',
                text: 'Smokey',
            },
            8: {
                image: 'https://placekitten.com/200/220',
                text: 'Gizmo',
            },
            9: {
                image: 'https://placekitten.com/220/239',
                text: 'Kitty',
            },
        };

        this.flag = false;

        this.currentUserId = this.props.navigation.state.params.userid;
    }

    componentDidMount() {
        // this.renderItemsIncircle()
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

        this.renrederMembers();
    }

    monthsBetweenTwoDates(start, end) {
        let startDate = moment(start)
        let endDate = moment(end)

        let timeValues = [];

        while (endDate >= startDate) {
            timeValues.push(startDate.format('YYYY-MM-DD'));
            startDate.add(1, 'month');
        }

        return timeValues;
    }

    getUnConfirmedRequests() {

        let renderedRequests = [];
        this.state.renderedRequestsList = [];

        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetCycleMembers",
            data: JSON.stringify({
                User_id: this.props.navigation.state.params.userid,
                Cycle_id: this.props.navigation.state.params.cycleid.id
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((resp) => {

            if (resp.data.months.length > 0) {
                let monthsToBeConfirmed = resp.data.months;

                for (let x = 0; x < monthsToBeConfirmed.length; x++) {

                    if (monthsToBeConfirmed[x].status === "requested") {
                        renderedRequests.push(
                            <ListItem icon key={x}>
                                <Left>
                                    <Icon name="md-person-add" />
                                </Left>
                                <Body>
                                    <Text>{resp.data.users[x].full_name} - Month : {monthsToBeConfirmed[x].cyclE_MONTH}</Text>
                                </Body>
                                <Right>
                                    <Button small onPress={() => {
                                        this.confirmRequest(monthsToBeConfirmed[x].cyclE_ID, resp.data.users[x].id)
                                    }}><Text>Confirm</Text></Button>
                                </Right>
                            </ListItem>
                        )
                    }

                }
            }

            if (renderedRequests.length === 0) {
                renderedRequests.push(
                    <ListItem icon key={0}>
                        <Left>
                        </Left>
                        <Body>
                            <Text>There's no pending requests</Text>
                        </Body>
                        <Right>
                        </Right>
                    </ListItem>
                )
            }

            this.setState({ renderedRequestsList: renderedRequests })


        })
            .catch((err) => {
                alert("Unexpected error")
            })
    }

    renrederMembers() {

        let renderedMembers = []
        this.state.renderedMembers = [];

        let component = this;
        var angle = 0;
        var width = Dimensions.get('window').width * 80 / 100;
        var radius = width / 2;

        var height = parseInt(Dimensions.get('window').height) * 60 / 100;


        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetCycleMembers",
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
                // if (resp.data.users.length > 0) {
                let numberOfMembers = this.props.navigation.state.params.cycleid.numbeR_OF_MEMBERS;
                let startDate = this.props.navigation.state.params.cycleid.startDate;
                let endDate = this.props.navigation.state.params.cycleid.endDate;

                let months = this.monthsBetweenTwoDates(startDate, endDate);

                var step = (2 * Math.PI) / numberOfMembers;

                for (var x = 0; x < numberOfMembers; x++) {
                    var findMemberByMonth = _.find(resp.data.months, (o) => {
                        return o.cyclE_MONTH === parseInt(moment(months[x]).format("M"))
                    })

                    if (findMemberByMonth) {
                        var memberItSelf = _.find(resp.data.users, function (o) {
                            return o.id === findMemberByMonth.useR_JOINED_ID
                        })

                    }
                    if (findMemberByMonth) {
                        renderedMembers.push(
                            <TouchableOpacity onPress={() => { alert("open profile") }} key={x} style={{
                                borderRadius: 100 / 2, backgroundColor: '#262261', width: 60, height: 60,
                                left: Math.round(width / 2 + radius * Math.cos(angle) - 4),
                                top: Math.round(height / 2 + radius * Math.sin(angle) - 4),
                                position: "absolute",
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Text style={{ color: "white", fontSize: 8 }}>{months[x]}</Text>
                                <Text style={{ color: "white", fontSize: 8 }}>{memberItSelf.full_name}</Text>
                            </TouchableOpacity>


                        )
                    }
                    else {
                        let shareOptions = {
                            title: "ElGameya app",
                            message: "join gameya : " + this.props.navigation.state.params.cycleid.cyclE_NAME
                                + "from this link : https://elgameya/gameya/" + this.props.navigation.state.params.cycleid.cyclE_NAME + "/" + parseInt(moment(months[x]).format("M"))
                            ,
                            url: "https://elgameya.net/gameya/" + this.props.navigation.state.params.cycleid.cyclE_NAME + "/" + parseInt(moment(months[x]).format("M")),
                            subject: "ElGameya app" //  for email
                        };
                        renderedMembers.push(
                            <TouchableOpacity onPress={() => { Share.open(shareOptions); }} key={x} style={{
                                borderRadius: 100 / 2, borderColor: '#262261', borderWidth: 1, width: 60, height: 60,
                                left: Math.round(width / 2 + radius * Math.cos(angle) - 4),
                                top: Math.round(height / 2 + radius * Math.sin(angle) - 4),
                                position: "absolute",
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Text style={{ color: "#262261", fontSize: 8 }}>{months[x]}</Text>
                                <Image style={{ height: 30, width: 30, alignSelf: "center" }}
                                    source={require('../imgs/addMembers.png')} />
                            </TouchableOpacity>


                        )
                    }
                    /*   <ListItem style={{ height: 90 }} icon key={x} onPress={() => {
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
                        */
                    angle += step;
                }
                this.setState({ renderedMembers: renderedMembers, noMembers: false }, () => {
                    // this.refs.ModalMembers.open();
                })
                // }
                /*         else {
                                    renderedMembers.push(
                                        <ListItem key={0} style={{ height: 50 }}>
                                            <Body><Text>No members</Text></Body>
                                        </ListItem>
                                    )
                            this.setState({renderedMembers: renderedMembers, noMembers: true }, () => {
                                    // this.refs.ModalMembers.open();
                                })
                        } */

            })
            .catch((err) => {
                debugger;
                alert("Unexpected error");

            })
    }

    confirmRequest(cycleid, userid) {

        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/AdminConfirmRequests",
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
            url: "http://www.elgameya.net/api/gamieya/FollowUser",
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
            url: "http://www.elgameya.net/api/gamieya/RateUser",
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
            url: "http://www.elgameya.net/api/gamieya/UnfollowUser",
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
            url: "http://www.elgameya.net/api/gamieya/RemoveReminders",
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
                            url: "http://www.elgameya.net/api/gamieya/AddReminders",
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
                url: "http://www.elgameya.net/api/gamieya/RemoveReminders",
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
                    url: "http://www.elgameya.net/api/gamieya/SendMessage",
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

    renderPopupMenu() {
        return (
            <Menu onSelect={value => { this.handlePopupMenuClick(value) }}>
                <MenuTrigger>
                    <Icon name='ios-settings' style={{ color: "white" }} />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption value='Edit cycle' text='Edit cycle' />
                    <MenuOption value='Group Message' text='Group Message' />
                    <MenuOption value='Delete cycle' text='Delete cycle' />
                    <MenuOption value='Info' text='Info' />
                </MenuOptions>
            </Menu>
        )
    }

    handlePopupMenuClick(value) {
        if (value === "Edit cycle") {
this.refs.ModalEditList.open();
        }
        if (value === "Group Message") {

        }
        if (value === "Delete cycle") {
            this.refs.ModalDeleteCycle.open();


        }
        if (value === "Info") {

        }
    }

    handleDeleteMyCycle() {
        let dataToBeSent = {
            id: this.props.navigation.state.params.cycleid.id
        }
        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/AdminDeleteCycle",
            data: JSON.stringify(dataToBeSent),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((resp) => {
            if (resp.data.status === "success") {
                // alert(resp.data.message);
                const { navigate } = this.props.navigation;
                navigate("MyCycles", { userid: this.props.navigation.state.params.userid });

            }
        })
            .catch((err) => {
                alert("Unexpected error")
            })
    }

    handleTabChange(data, ref) {
        if (data.i === 0) {
            this.renrederMembers();
        }
        if (data.i === 1) {

            this.getUnConfirmedRequests();
        }
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

                <Modal backButtonClose={true} style={[styles.modal, styles.modalProfile]} position={"center"} ref={"ModalProfile"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Content>
                            {this.state.showData ? this.renderProfileData(this.state.profileResponse) : null}
                        </Content>
                    </Container>
                </Modal>

                {/*   ////////////////////////////////////////////////    */}

                <Modal backButtonClose={true} style={[styles.modal, styles.modalProfile]} position={"center"} ref={"ModalEditList"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <View style={{height:500}}>
                            <SortableList
                                style={styles.list}
                                contentContainerStyle={styles.contentContainer}
                                data={this.ListData}
                                renderRow={(data, active) => {
                                    return <View><Text>{data.data.text}</Text></View>
                                }} 
                               
                                onChangeOrder={(nextOrder)=>{

                                }}
                                />

                    </View>
                </Modal>

                <Modal backButtonClose={true} style={[styles.modal, styles.ModalDeleteCycle]} position={"center"} ref={"ModalDeleteCycle"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Content>
                            <Grid>
                                <Row>
                                    <Col style={{ width: "10%" }}></Col>
                                    <Col style={{ width: "80%" }}>
                                        <Text>Are you sure you want to delete this cycle ?</Text>
                                    </Col>
                                    <Col style={{ width: "10%" }}></Col>
                                </Row>
                                <Row>
                                    <Col style={{ width: "40%" }}>
                                        <Button style={{ borderRadius: 10, backgroundColor: "#9E1F64" }} onPress={() => {
                                            this.refs.ModalDeleteCycle.close();
                                        }}><Text>Cancel</Text></Button>
                                    </Col>
                                    <Col style={{ width: "40%" }}>
                                    </Col>
                                    <Col style={{ width: "40%" }}>
                                        <Button style={{ borderRadius: 10, backgroundColor: "#9E1F64" }} onPress={() => { this.handleDeleteMyCycle() }}><Text>Ok</Text></Button>
                                    </Col>
                                </Row>
                            </Grid>
                        </Content>
                    </Container>

                </Modal>

                <Modal backButtonClose={true} style={[styles.modal, styles.modalReminder, { zIndex: 10, position: "absolute" }]} position={"center"} ref={"ModalReminder"}
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
                <MenuProvider>
                    <Content>
                        <Header ref="myheader" style={{ backgroundColor: "#9E1F64" }}>
                            <Left>
                                <Button transparent onPress={() => {
                                    navigate("MyCycles", { userid: this.props.navigation.state.params.userid });

                                }}>
                                    <Icon name='arrow-back' />
                                </Button>
                            </Left>
                            <Body>
                                <Title>{this.props.navigation.state.params.cycleid.cyclE_NAME}</Title>
                            </Body>
                            <Right>
                                <Grid>
                                    <Row style={{ marginTop: 15 }}>
                                        <Col style={{ width: "30%" }}></Col>

                                        <Col style={{ width: "50%" }}>
                                            {this.renderPopupMenu()}

                                        </Col>
                                        <Col style={{ width: "20%" }}>
                                            <Icon onPress={() => {
                                                this.handleReminders();
                                            }} name='md-alarm' style={{ color: "white" }} />
                                        </Col>
                                    </Row>
                                </Grid>



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

                        {/*       <Tabs initialPage={0} onChangeTab={(i, ref) => {
                            this.handleTabChange(i, ref);
                        }}>
                            <Tab heading="Joined">
                                {this.state.noMembers ? <List></List> :
                                    <Grid>
                                        <Row>
                                            <Col style={{ width: "5%" }}></Col>
                                            <Col style={{ position: 'relative', width: "80%", height: 400 }}>
                                                {this.state.renderedMembers}
                                            </Col>
                                            <Col style={{ width: "15%" }}></Col>
                                        </Row>
                                    </Grid>
                                }
                            </Tab>
                            <Tab heading="Pending">
                                <List>
                                    {this.state.renderedRequestsList}
                                </List>
                            </Tab>

                        </Tabs> */}

                        <TabView tabBarPosition="top"
                            style={{ flex: 1, height: 500 }}
                            tabs={[{
                                text: "Joined",
                                onPress: () => {
                                    this.state.renderedRequestsList = []
                                    this.renrederMembers()
                                },
                                component: <Grid>
                                    <Row>
                                        <Col style={{ width: "5%" }}></Col>
                                        <Col style={{ position: 'relative', width: "80%", height: 400 }}>
                                            {this.state.renderedMembers}
                                        </Col>
                                        <Col style={{ width: "15%" }}></Col>
                                    </Row>
                                </Grid>
                            }, {
                                text: "Pending",
                                onPress: () => {
                                    this.state.renderedMembers = []

                                    this.getUnConfirmedRequests()
                                },
                                component:
                                    <Grid>
                                        <Row>
                                            <Col>
                                                <List>
                                                    {this.state.renderedRequestsList}
                                                </List>
                                            </Col>
                                        </Row>
                                    </Grid>

                            }]}
                            renderTabBar={(isActive, tab) => {
                                console.log("render tab bar")
                                if (isActive) {
                                    return <Text style={{ color: "black", borderColor: "black", borderWidth: 0.5, backgroundColor: "#9E1F64", textAlign: "center", height: 30, lineHeight: 30 }}>{tab.text}</Text>
                                }
                                return <Text style={{ color: "black", borderColor: "black", borderWidth: 0.5, textAlign: "center", height: 30, lineHeight: 30 }}>{tab.text}</Text>
                            }}>
                        </TabView>



                    </Content>
                </MenuProvider>
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

    ModalDeleteCycle: {
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