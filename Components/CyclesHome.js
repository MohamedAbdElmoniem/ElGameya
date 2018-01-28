/**
 * Created by abdelmon on 9/28/2017.
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
    View, ScrollView, BackHandler,
    TouchableOpacity, Switch, AsyncStorage, TouchableHighlight,
    Image, Dimensions, Linking
} from 'react-native';
import { Button } from 'native-base';
import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Grid,
    Col, CheckBox,
    Row,
    Right, Badge,
    Form,
    Item,
    Input, Label,
    Icon,
    Thumbnail,
    Title,
    StyleProvider, List, ListItem, Card, CardItem,
} from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import StarRating from 'react-native-star-rating';
var { width } = Dimensions.get('window');
var { height } = Dimensions.get('window');
import axios from 'axios'
import Modal from 'react-native-modalbox';
var moment = require('moment');
import Spinner from 'react-native-loading-spinner-overlay';
import Share, { ShareSheet } from 'react-native-share';
import Toast, { DURATION } from 'react-native-easy-toast';
import { ProgressDialog } from 'react-native-simple-dialogs';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import { BackHandler as Back1 } from 'react-native'
var myback = Back1;


class CyclesHome extends Component {
    static navigationOptions = {
        title: "ElGameya",
        header: null,
        drawerLabel: 'Home',
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-home-outline" style={{ color: "white" }} />
        ),
    }

    _showDateTimePicker = (type) => this.setState({ isDateTimePickerVisible: true, StartOrEnd: type });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

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
            amountPerMonth: "",
            totalAmountPerCycle: "",
            ReceiverId: "",
            message: "",
            Amounts: [
                { value: 500, status: "unselected" },
                { value: 1000, status: "unselected" },
                { value: 2000, status: "unselected" },
                { value: 3000, status: "unselected" },
                { value: 4000, status: "unselected" },
                { value: 5000, status: "unselected" },
                { value: 6000, status: "unselected" },
                { value: 7000, status: "unselected" },
                { value: 8000, status: "unselected" },
                { value: 9000, status: "unselected" },
                { value: 10000, status: "unselected" }
            ],
            renderedAmountsInCircles: [],
            selectedAmount: ""

        }

        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        this.handleBackButton2 = this.handleBackButton2.bind(this);
        this.renderAmountsInCircles = this.renderAmountsInCircles.bind(this);
        this.handleSelectAmount = this.handleSelectAmount.bind(this);
    }

    handleBackButton2() {

        return true;

    }

    renderAmountsInCircles() {
        let component = this;
        let renderedAmounts = [[], []];

        for (let x = 0; x < this.state.Amounts.length; x++) {

            if (x <= 5) {
                if (this.state.Amounts[x].status === "unselected") {
                    renderedAmounts[0].push(
                        <Col style={{ width: "15%", marginRight: 3 }} key={x}>
                            <TouchableOpacity onPress={() => {
                                this.handleSelectAmount(this.state.Amounts[x], "unselected")
                            }}>
                                <View style={{
                                    width: 45, height: 45, borderRadius: 45 / 2,
                                    borderColor: '#262261',
                                    alignItems: 'center',
                                    borderStyle: "dotted",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    borderWidth: 2

                                }}>
                                    <Text style={{ color: "#262261", fontSize: 10 }}>{this.state.Amounts[x].value}</Text>
                                    <Text style={{ color: "#262261", fontSize: 10 }}>EGP</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>
                    )

                }
                else {
                    renderedAmounts[0].push(
                        <Col style={{ width: "15%", marginRight: 3 }} key={x}>

                            <TouchableOpacity onPress={() => {
                                this.handleSelectAmount(this.state.Amounts[x], "selected")
                            }}>
                                <View style={{
                                    width: 45, height: 45, borderRadius: 45 / 2,
                                    borderColor: '#9E1F64',
                                    alignItems: 'center',
                                    borderStyle: "dotted",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    borderWidth: 2

                                }}>
                                    <Text style={{ color: "#9E1F64", fontSize: 10 }}>{this.state.Amounts[x].value}</Text>
                                    <Text style={{ color: "#9E1F64", fontSize: 10 }}>EGP</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>
                    )

                }
            }
            else {
                if (this.state.Amounts[x].status === "unselected") {
                    renderedAmounts[1].push(
                        <Col key={x} style={{ width: "15%", marginRight: 3 }}>

                            <TouchableOpacity onPress={() => {
                                this.handleSelectAmount(this.state.Amounts[x], "unselected")
                            }}>
                                <View style={{
                                    width: 45, height: 45, borderRadius: 45 / 2,
                                    borderColor: '#262261',
                                    alignItems: 'center',
                                    borderStyle: "dotted",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    borderWidth: 2

                                }}>
                                    <Text style={{ color: "#262261", fontSize: 10 }}>{this.state.Amounts[x].value}</Text>
                                    <Text style={{ color: "#262261", fontSize: 10 }}>EGP</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>
                    )

                }
                else {
                    renderedAmounts[1].push(
                        <Col key={x} style={{ width: "15%", marginRight: 3 }}>

                            <TouchableOpacity onPress={() => {
                                this.handleSelectAmount(this.state.Amounts[x], "selected")
                            }}>
                                <View style={{
                                    width: 45, height: 45, borderRadius: 45 / 2,
                                    borderColor: '#9E1F64',
                                    alignItems: 'center',
                                    borderStyle: "dotted",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    borderWidth: 2
                                }}>
                                    <Text style={{ color: "#9E1F64", fontSize: 10 }}>{this.state.Amounts[x].value}</Text>
                                    <Text style={{ color: "#9E1F64", fontSize: 10 }}>EGP</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>
                    )

                }
            }

        }
        ;
        component.setState({ renderedAmountsInCircles: renderedAmounts })


    }

    handleSelectAmount(data, status) {
        if (status === "unselected") {
            for (let x = 0; x < this.state.Amounts.length; x++) {
                if (this.state.Amounts[x].status === "selected") {
                    this.state.Amounts[x].status = "unselected";
                }
            }
            let findedIndex = _.findIndex(this.state.Amounts, data);
            this.state.Amounts[findedIndex].status = "selected";

            if (this.state.noOfMembers != "") {
                let total_amount = "";
                let findSelectedAmount = _.find(this.state.Amounts, (o) => {
                    return o.status === "selected"
                });
                if (findSelectedAmount != undefined) {
                    total_amount = findSelectedAmount.value;
                    let total = (parseInt(this.state.noOfMembers) * parseInt(total_amount)).toString();
                    this.setState({ totalAmountPerCycle: total })
                }
                else {
                    if (this.state.selectedAmount != "") {
                        total_amount = this.state.selectedAmount
                        let total = (parseInt(this.state.noOfMembers) * parseInt(total_amount)).toString();
                        this.setState({ totalAmountPerCycle: total })
                    }
                    else {
                        this.setState({ totalAmountPerCycle: "" })
                        //  alert("please enter amount per month");
                    }
                }

            }
            else {
                this.setState({ totalAmountPerCycle: "" })
            }

        }
        if (status === "selected") {
            let findedIndex = _.findIndex(this.state.Amounts, data);
            this.state.Amounts[findedIndex].status = "unselected";
        }

        this.setState({}, () => {
            this.renderAmountsInCircles();
            this.setState({ selectedAmount: "" })
        })
    }

    makeAllAmountsUnSelected = () => {

        for (let x = 0; x < this.state.Amounts.length; x++) {
            if (this.state.Amounts[x].status === "selected") {
                this.state.Amounts[x].status = "unselected";
            }
        }
        this.setState({}, () => {
            this.renderAmountsInCircles();
        })
    }



    componentWillUnmount() {
        myback.removeEventListener('hardwareBackPress', this.handleBackButton2);
    }


    componentDidMount() {

        let cycleName = "";
        let cycleMonth = "";
        let flag = false;

        const url = Linking.getInitialURL().then(urlString => {
            if (urlString !== null) {
                urlString = urlString.split("/")
                cycleName = urlString[4];
                cycleMonth = urlString[5];

                let cycleDataTobeSent = {
                    userid: this.props.navigation.state.params.id,
                    month: cycleMonth,
                    cyclename: cycleName
                }


                axios({
                    method: "POST",
                    url: "http://www.elgameya.net/api/gamieya/JoinCycleFromDeepLink",
                    data: JSON.stringify(cycleDataTobeSent),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then((resp) => {
                        if (resp.data.status === "success") {
                            if (resp.data.message != undefined) {
                                if (flag === false) {
                                    //  alert(resp.data.message)
                                    flag = true;
                                }
                            }
                            else {
                                if (flag === false) {
                                    alert("you have joined the cycle successfully")
                                    flag = true;

                                }
                            }
                        }

                    })
                    .catch((err) => {
                        console.log(err)
                        //  this.refs.toast.show('Unexpected error');
                        this.setState({ visible: false });

                    })


            }
        })



        myback.addEventListener('hardwareBackPress', this.handleBackButton2);
    }

    handleCreateCycle = () => {
        this.setState({ selectedStartDate: "", selectedEndDate: "" })
        this.renderAmountsInCircles();
        this.refs.modal3.open()
    }



    onCancel() {
        console.log("CANCEL")
        this.setState({ visible: false });
    }

    onOpen() {
        console.log("OPEN")
        this.setState({ visible: true });
    }

    _showDateTimePicker = (type) => this.setState({ isDateTimePickerVisible: true, StartOrEnd: type });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        console.log(moment(date).format("YYYY-MM-DD"))
        if (this.state.StartOrEnd === "start") {
            if (this.state.type === "create") {
                let endDate = moment(date)
                for (let x = 0; x < parseInt(this.state.noOfMembers) - 1; x++) {
                    endDate = endDate.add(1, "months")
                }

                this.setState({ selectedStartDate: moment(date).format("YYYY-MM-DD"), selectedEndDate: endDate.format("YYYY-MM-DD") }, () => {
                    console.log(this.state.selectedStartDate);
                    console.log(this.state.selectedEndDate);
                })
            }
            else {
                this.setState({ selectedStartDate: moment(date).format("YYYY-MM-DD") })
            }



        }
        else {
            if (this.state.selectedStartDate === "") {
                alert("please enter start month")
            }
            else {
                if (moment(this.state.selectedStartDate) > moment(date) || moment(date).format("YYYY-MM-DD") === this.state.selectedStartDate) {
                    alert("selected end month is before or equal start month");
                }
                else {
                    this.setState({ selectedEndDate: moment(date).format("YYYY-MM-DD") }, () => {
                        var dateStart = moment(this.state.selectedStartDate);
                        var dateEnd = moment(this.state.selectedEndDate);

                        var timeValues = [];

                        while (dateEnd > dateStart) {
                            timeValues.push(dateStart.format("YYYY-MM-DD"));
                            dateStart.add(1, 'month');
                        }

                        //     this.setState({ noOfMembers: (timeValues.length + 1).toString() })

                    })

                }

            }

        }
        this._hideDateTimePicker();
    };

    handleCancel = () => {
        this.refs.modal3.close();
    }

    submitCycleCreation = () => {
        let component = this;

        if (this.state.selectedStartDate == "" || this.state.selectedEndDate == "" || this.state.noOfMembers == ""
            || this.state.cycleName == "" || this.state.totalAmountPerCycle == "") {

            alert("please enter all fields")

        }
        else {
            let cycleData = {}
            this.setState({ progressVisible: true })
            let total_amount = "";
            let findSelectedAmount = _.find(this.state.Amounts, (o) => {
                return o.status === "selected"
            });
            if (findSelectedAmount != undefined) {
                total_amount = findSelectedAmount.value;
            }
            else {
                total_amount = this.state.selectedAmount
            }
            let _total_amount = (parseInt(this.state.noOfMembers) * parseInt(total_amount)).toString();

            cycleData =
                {
                    CYCLE_NAME: this.state.cycleName,
                    NUMBER_OF_MEMBERS: this.state.noOfMembers,
                    TOTAL_AMOUNT: _total_amount,
                    startDate: this.state.selectedStartDate,
                    endDate: this.state.selectedEndDate,
                    privacy: this.state.cyclePrivacy,
                    ADMIN_ID: component.props.navigation.state.params.id
                }
            console.log(JSON.stringify(cycleData))
            const { navigate } = this.props.navigation;
            axios({
                method: "POST",
                url: "http://www.elgameya.net/api/gamieya/CreateCycle",
                data: JSON.stringify(cycleData),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((resp) => {
                    console.log(resp)
                    if (resp.data.status === "failure") {
                        this.setState({ progressVisible: false }, () => {
                            alert(resp.data.message);

                        });
                    }
                    else if (resp.data.status === "success") {
                        this.setState({ progressVisible: false }, () => {
                            alert(resp.data.message);

                        });
                    }
                    else {
                        this.refs.modal3.close()
                        this.setState({ progressVisible: false });
                        //  alert("Cycle created successfully")
                        navigate("MyCycles", { userid: this.props.navigation.state.params.id, option: "create" });
                    }
                })
                .catch((err) => {
                    console.log(err)
                    //  alert("Unexpected error");
                    this.refs.toast.show('Unexpected error');

                    this.setState({ visible: false });

                })


        }
    }

    searchForCycle = () => {


    }

    handleCancelSearchModal = () => {
        this.refs.modalSearch.close();
    }

    submitSearchCycle = () => {
        let component = this;

        if ((this.state.selectedEndDate == "" || this.state.selectedStartDate == "" || this.state.amountForSearch == "") && this.state.getAll === false) {
            alert("please enter all fields");
        }

        else {

            let methodtype = "POST";
            let url = "GetCycle"

            if (this.state.getAll === true) {
                methodtype = "POST"
                url = "GetCycles"
            }
            let searchData = {}
            this.setState({ progressVisible: true })
            searchData =
                {
                    startDate: this.state.selectedStartDate,
                    endDate: this.state.selectedEndDate,
                    TOTAL_AMOUNT: this.state.amountForSearch

                }


            console.log(JSON.stringify(searchData))
            searchData = JSON.stringify(searchData);
            if (this.state.getAll === true) {
                searchData = { id: component.props.navigation.state.params.id }
            }

            axios({
                method: methodtype,
                url: "http://www.elgameya.net/api/gamieya/" + url,
                data: searchData,
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((resp) => {
                    this.setState({ progressVisible: false, returnedCycles: resp.data });
                    console.log(resp)

                    this.refs.modalSearch.close();
                    this.setState({ progressVisible: true })


                    setTimeout(() => {

                        this.refs.modal2.open();
                        this.setState({ progressVisible: false })


                    }, 1000)

                    // alert("Logged in successfully");

                })
                .catch((err) => {
                    this.setState({ progressVisible: false }, () => {
                        alert("Unexpected error");
                    });

                })
        }


    }

    openCyclesModal = () => {

        let renderedListOfCycles = [];

        if (this.state.returnedCycles.length > 0) {
            for (let x = 0; x < this.state.returnedCycles.length; x++) {
                renderedListOfCycles.push(
                    <Card key={x}>
                        <CardItem header>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Cycle : {this.state.returnedCycles[x].cyclE_NAME}</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>StartDate : {this.state.returnedCycles[x].startDate}</Text>
                                <Text>EndDate : {this.state.returnedCycles[x].endDate}</Text>
                                <Text>Number of members : {this.state.returnedCycles[x].numbeR_OF_MEMBERS}</Text>
                                <Text>Amount : {this.state.returnedCycles[x].totaL_AMOUNT}</Text>
                            </Body>
                        </CardItem>
                        <CardItem style={{ justifyContent: "center", alignItems: "center" }}>
                            <Button style={{ backgroundColor: "#262261", width: "70%", height: 40, alignItems: "center", justifyContent: "center", borderRadius: 12 }} onPress={() => {
                                this.getCycleMonths(this.state.returnedCycles[x])
                            }}>
                                <Text style={{ color: "white" }}>Get cycle months</Text>
                            </Button>
                        </CardItem>
                    </Card>
                )
            }


            this.setState({ renderedCycles: renderedListOfCycles })

        }

    }

    getCycleMonths = (data) => {
        let component = this;
        let renderedData = [];
        this.refs.modal2.close();
        this.setState({ progressVisible: true });

        setTimeout(() => {

            axios({
                method: "POST",
                url: "http://www.elgameya.net/api/gamieya/GetMonthsOfCycle",
                data: JSON.stringify({ id: data.id }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((resp) => {
                    let MonthsData = resp.data.data;
                    ;
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

                    })
                })
                .catch((err) => {
                    console.log(err)
                    component.setState({ progressVisible: false }, () => {
                        alert("Unexpected error");
                    })

                })


            this.refs.modalMonths.open();
        }, 1500)

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
            url: "http://www.elgameya.net/api/gamieya/GetUserProfile",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ progressVisible: false });
                console.log(resp)
                let response = resp.data;
                renderedProfile.push(<View key={0} style={{ borderRadius: 12 }}>
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
                </View>);

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


    renderProfileData(response) {
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


    handleJoinCycle = (month, admiN_ID) => {
        let component = this;
        let choosenCycle = this.state.choosenCycleId;
        let id = component.props.navigation.state.params.id

        this.setState({ progressVisible: true });
        let data = {
            User_id: id,
            Cycle_id: choosenCycle,
            Month: month
        }

        // join in specific month of cycle
        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/JoinCycle",
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
                    alert("Unexpected error");
                })
            })


    }

    handleOpenMyCycles = () => {

        this.doGetMyCycles();
    }



    doGetMyCycles = () => {
        let component = this;
        let renderedData = [];
        let id = component.props.navigation.state.params.id;


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
                if (resp.data.mycycles.length > 0) {

                    for (let x = 0; x < resp.data.mycycles.length; x++) {
                        renderedData.push(
                            <Card key={x}>
                                <CardItem header>
                                    <Text>{resp.data.mycycles[x].cyclE_NAME}</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Text>
                                            StartDate : {resp.data.mycycles[x].startDate}
                                        </Text>
                                        <Text>EndDate : {resp.data.mycycles[x].endDate}</Text>
                                        <Text>Number of members : {resp.data.mycycles[x].numbeR_OF_MEMBERS}</Text>
                                        <Text>Amount : {resp.data.mycycles[x].totaL_AMOUNT} </Text>
                                        <Text>Reserved Month : {resp.data.cycles[x].cyclE_MONTH}</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        )
                    }

                }
                this.setState({ returnedMyCycles: renderedData })
            })
            .catch((err) => {
                console.log(err)
                alert("Unexpected error");

            })

    }

    openMonthsModal = () => {


    }

    handleShowNotifications = () => {

        this.setState({ progressVisible: true });
        let component = this;
        let id = component.props.navigation.state.params.id;
        let renderedNotifications = [];
        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetTopTenNotifications",
            data: JSON.stringify({ Id: id }),
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


    render() {
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
                <Content>
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

                    <Header style={{ backgroundColor: "#9E1F64" }}>
                        <Left>
                            <Icon name="menu" style={{ color: "white" }} onPress={() => {
                                this.props.navigation.navigate('DrawerOpen'); // open drawer
                            }} />
                        </Left>
                        <Body>
                            <Title>Home</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => {
                                this.handleShowNotifications()
                            }}>
                                <Icon name='md-notifications' style={{ color: "white" }} />
                            </Button>
                        </Right>
                    </Header>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 50
                        }}>
                            <TouchableOpacity onPress={this.handleCreateCycle}>
                                <View style={styles.HollowCircle}>
                                    <View style={styles.cycleButton}>
                                        <Image style={{ height: 30, width: 30, alignSelf: "center", marginTop: 25 }}
                                            source={require('../imgs/create.png')}
                                        />
                                        <Text style={styles.textColor}>Create</Text>
                                        <Text style={styles.textColor2}>cycle</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <Text>
                                {"\n"}
                            </Text>
                            <Text>
                                {"\n"}
                            </Text>

                            <TouchableOpacity onPress={() => {
                                const { navigate } = this.props.navigation;
                                navigate("AllCycles", { userid: this.props.navigation.state.params.id });

                            }}>
                                <View style={styles.HollowCircle}>
                                    <View style={styles.cycleButton}>
                                        <Image style={{
                                            height: 30, width: 30, alignSelf: "center", marginTop: 25
                                        }}
                                            source={require('../imgs/join.png')}
                                        />
                                        <Text style={styles.textColor}>Join</Text>
                                        <Text style={styles.textColor2}>cycle</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Content>
                <Modal backButtonClose={true} style={[styles.modal, styles.modalCreate]} position={"center"} ref={"modal3"}
                    isDisabled={this.state.isDisabled} swipeToClose={false}>
                    <Content>
                        <Grid>
                            <Row>
                                <Col></Col>
                                <Col style={{ flex: 1, flexDirection: "row" }}>
                                    <Image style={{ height: 30, width: 30 }}
                                        source={require('../imgs/create.png')}
                                    />
                                    <Text style={{ fontWeight: "bold", fontSize: 13, color: "#262261", marginTop: 5, marginLeft: 5 }}>
                                        Create Cycle
                                        </Text></Col>
                                <Col></Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Text style={{ textAlign: "center" }}>
                                        ───────────────────
                                </Text></Col>
                            </Row>
                          
                            <Row style={{ marginTop: 5 }} >
                                <Col>
                                </Col>
                            </Row>
                            <Row>
                                <Card>
                                    <Grid>
                                        <Row>
                                            <Col style={{ width: "10%" }}></Col>
                                            <Col style={{ width: "30%" }}><Text>Amount</Text></Col>
                                            <Col style={{ width: "50%" }}></Col>
                                            <Col style={{ width: "10%" }}></Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ width: "3%" }}></Col>
                                            {this.state.renderedAmountsInCircles[0]}
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col style={{ width: "3%" }}></Col>

                                            {this.state.renderedAmountsInCircles[1]}
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col>
                                                <Input style={{ borderRadius: 10, borderColor: "black", height: 40, borderWidth: 0.5, marginLeft: 10, marginRight: 10 }} placeholder="enter amount ..." value={this.state.selectedAmount} onChangeText={(text) => {
                                                    if (!text.match(/[0-9]/)) {
                                                        alert("please enter only numbers")

                                                    }
                                                    else {
                                                        this.setState({ selectedAmount: text }, () => {
                                                            if (this.state.noOfMembers != "") {
                                                                let total_amount = "";
                                                                let findSelectedAmount = _.find(this.state.Amounts, (o) => {
                                                                    return o.status === "selected"
                                                                });
                                                                if (findSelectedAmount != undefined) {
                                                                    total_amount = findSelectedAmount.value;
                                                                    let total = (parseInt(this.state.noOfMembers) * parseInt(total_amount)).toString();
                                                                    this.setState({ totalAmountPerCycle: total })
                                                                }
                                                                else {
                                                                    if (this.state.selectedAmount != "") {
                                                                        total_amount = this.state.selectedAmount
                                                                        let total = (parseInt(this.state.noOfMembers) * parseInt(total_amount)).toString();
                                                                        this.setState({ totalAmountPerCycle: total })
                                                                    }
                                                                    else {
                                                                        this.setState({ totalAmountPerCycle: "" })
                                                                        // alert("please enter amount per month");
                                                                    }
                                                                }

                                                            }
                                                            else {
                                                                this.setState({ totalAmountPerCycle: "" })
                                                            }
                                                        });

                                                        this.makeAllAmountsUnSelected();
                                                    }

                                                }} />
                                            </Col>
                                        </Row>
                                    </Grid>
                                    <View style={{ height: 15 }}></View>
                                </Card>
                            </Row>
                            <Row ><Col><Input placeholder="Number Of Members" style={{ fontSize: 14, width: "100%", backgroundColor: "white", borderRadius: 10 }} value={this.state.noOfMembers}
                                onChangeText={(text) => {
                                    if (parseInt(text) < 13 && text.match(/[0-9]/) || this.state.noOfMembers === "") {
                                        let findSelectedAmount = {}

                                        this.setState({ noOfMembers: text }, () => {
                                            if (this.state.noOfMembers != "") {
                                                let total_amount = "";
                                                let findSelectedAmount = _.find(this.state.Amounts, (o) => {
                                                    return o.status === "selected"
                                                });
                                                if (findSelectedAmount != undefined) {
                                                    total_amount = findSelectedAmount.value;
                                                    let total = (parseInt(this.state.noOfMembers) * parseInt(total_amount)).toString();
                                                    this.setState({ totalAmountPerCycle: total })
                                                }
                                                else {
                                                    if (this.state.selectedAmount != "") {
                                                        total_amount = this.state.selectedAmount
                                                        let total = (parseInt(this.state.noOfMembers) * parseInt(total_amount)).toString();
                                                        this.setState({ totalAmountPerCycle: total })
                                                    }
                                                    else {
                                                        this.setState({ totalAmountPerCycle: "" })
                                                        // alert("please enter amount per month");
                                                    }
                                                }

                                            }
                                            else {
                                                this.setState({ totalAmountPerCycle: "" })
                                            }
                                        })



                                    }
                                    else if (!text.match(/[0-9]/)) {
                                        this.setState({ noOfMembers: "" })
                                        this.setState({ totalAmountPerCycle: "" })

                                    }
                                    else {
                                        alert("please enter number of members less than or equal 12");
                                        this.setState({ noOfMembers: "" })
                                        this.setState({ totalAmountPerCycle: "" })


                                    }
                                }}
                            /></Col></Row>
                            <Row style={{ marginTop: 2 }} >
                                <Col>
                                </Col>
                            </Row>
                            <Row><Col style={{

                            }}>
                                <Card>
                                    <CardItem>
                                        <View style={{ flex: 1, flexDirection: "column" }}>
                                            <Text style={{marginBottom:10}}>Cycle Total Amount</Text>
                                            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>

                                                <View style={{
                                                    width: 80, height: 80, borderRadius: 80 / 2,
                                                    borderColor: "#9E1F64",
                                                    borderStyle: "dotted",
                                                    alignContent: "center",
                                                    flexDirection: "column",
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderWidth: 3,
                                                    backgroundColor: "white"

                                                }}>
                                                    <View style={{ height: 30, marginTop: 20 }}>
                                                        {this.state.totalAmountPerCycle != "" ? <Text style={{ color: "#262261", fontSize: 12 }}>{this.state.totalAmountPerCycle}</Text>
                                                            : <Text style={{ color: "#9E1F64", fontSize: 14, fontWeight: "bold" }}>0000</Text>
                                                        }
                                                    </View>
                                                    <View style={{ height: 30 }}>
                                                        <Text style={{ color: "#9E1F64", fontSize: 12, fontWeight: "bold" }}>EGP</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </CardItem>
                                </Card>

                            </Col></Row>
                            <Row><Col><Input placeholder="Cycle Name" style={{ fontSize: 14, width: "100%", backgroundColor: "white", borderRadius: 10 }} value={this.state.cycleName}
                                onChangeText={(text) => {
                                    this.setState({ cycleName: text })
                                }}
                            /></Col></Row>
                            <View style={{ flex: 1, flexDirection: "row", top: "5%" }}>
                                <View style={{ flex: 0.5 }}>
                                    <Button style={{ backgroundColor: "#262261", borderRadius: 10 }} onPress={() => {
                                        if (this.state.totalAmountPerCycle == "") {
                                            alert("please enter all fields")
                                        }
                                        else {
                                            this.setState({ type: "create" }, () => {
                                                this._showDateTimePicker("start")

                                            });

                                        }
                                    }}>
                                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ color: "white", fontSize: 12, margin: -5 }}>Start month</Text>
                                        </View>
                                    </Button>
                                </View>
                                <View style={{ flex: 0.2 }}></View>
                                <View style={{ flex: 0.3, marginTop: 10 }}>
                                    {this.state.selectedStartDate != "" ? <Badge style={{ backgroundColor: "#A4A4A4", width: "100%", alignItems: "center", justifyContent: "center" }}>
                                        <Text style={{ color: "black" }}>{this.state.selectedStartDate}</Text>
                                    </Badge> : <View></View>}

                                </View>
                            </View>
                            <Row style={{ height: "10%", top: "3%" }}>
                                <Col>
                                    <List>
                                        <ListItem icon>
                                            <Body>
                                                <Text>Public</Text>
                                            </Body>
                                            <Right>
                                                <Switch thumbTintColor="#262261" onTintColor="#262261" onValueChange={(val) => {
                                                    this.setState({ cyclePrivacy: !this.state.cyclePrivacy })
                                                }} value={this.state.cyclePrivacy} />
                                            </Right>
                                        </ListItem>
                                    </List>
                                </Col>
                            </Row>
                            <Text>{"\n"}</Text>
                            <View style={{ flex: 1, flexDirection: "row", bottom: "7%" }}>
                                <View style={{ flex: 0.4, marginLeft: "8%" }}>
                                    <Button style={{ borderRadius: 10, backgroundColor: "#262261" }}
                                        onPress={this.handleCancel}>
                                        <Text style={{ color: "white" }}>cancel</Text>
                                    </Button></View>
                                <View style={{ flex: 0.2 }}></View>
                                <View style={{ flex: 0.4 }}>
                                    <Button onPress={this.submitCycleCreation} style={{ borderRadius: 10, backgroundColor: "#262261" }}>
                                        <Text style={{ color: "white" }}>
                                            Create
                                            </Text>
                                    </Button></View>
                            </View>
                        </Grid>
                    </Content>
                </Modal>


                <Modal backButtonClose={true} style={[styles.modal, styles.modalJoin]} position={"center"} ref={"modalSearch"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Content>
                            <Grid>
                                <Row>
                                    <Col></Col>
                                    <Col style={{ flex: 1, flexDirection: "row" }}>
                                        <Image style={{ height: 30, width: 30 }}
                                            source={require('../imgs/join.png')}
                                        />
                                        <Text style={{ fontWeight: "bold", fontSize: 13, color: "#262261", marginTop: 5, marginLeft: 5 }}>
                                            Join Cycle
                                    </Text></Col>
                                    <Col></Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Text style={{ textAlign: "center" }}>
                                            ────────────────────
                            </Text></Col>
                                </Row>
                                <View>
                                    <Text style={{ fontWeight: "bold", fontSize: 14, color: "#262261" }}>Filter</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                    <View style={{ flex: 0.5 }}>
                                        <Button style={{ backgroundColor: "#262261", borderRadius: 10 }} onPress={() => {
                                            this.setState({ type: "" }, () => {
                                                this._showDateTimePicker("start")
                                            });
                                        }}>
                                            <Text style={{ color: "white", fontSize: 12 }}>Start month</Text>
                                        </Button>
                                    </View>
                                    <View style={{ flex: 0.2 }}></View>
                                    <View style={{ flex: 0.3, marginTop: 10 }}>
                                        {this.state.selectedStartDate != "" ? <Badge style={{ backgroundColor: "#A4A4A4", width: "100%", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ color: "black" }}>{this.state.selectedStartDate}</Text>
                                        </Badge> : <View></View>}
                                    </View>
                                </View>
                                <Row style={{ height: 20 }}></Row>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                    <View style={{ flex: 0.5 }}>
                                        <Button style={{ backgroundColor: "#262261", borderRadius: 10 }} onPress={() => {
                                            this._showDateTimePicker("end")
                                        }}>
                                            <Text style={{ color: "white", fontSize: 12 }}>End month</Text>
                                        </Button>
                                    </View>
                                    <View style={{ flex: 0.2 }}></View>
                                    <View style={{ flex: 0.3, marginTop: 10 }}>
                                        {this.state.selectedEndDate != "" ? <Badge style={{ backgroundColor: "#A4A4A4", width: "100%", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ color: "black" }}>{this.state.selectedEndDate}</Text>
                                        </Badge> : <View></View>}
                                    </View>
                                </View>
                                <Row style={{ height: 20 }}></Row>
                                <Row>
                                    <Col>
                                        <Text style={{ fontWeight: "bold", fontSize: 12, color: "#262261" }}>Amount</Text>
                                    </Col>
                                </Row>
                                <Row ><Col>
                                    <Input style={{ fontSize: 14, width: "100%", backgroundColor: "white", borderRadius: 10 }} onChangeText={(text) => {
                                        text = text.replace(/[^0-9]/g, '');
                                        this.setState({ amountForSearch: text })
                                    }} /></Col></Row>


                                <Row style={{ height: 20 }}></Row>
                                <View style={{ flex: 1, flexDirection: "row", marginLeft: 10 }}>
                                    <View style={{ flex: 0.4 }}>
                                        <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>Get all cycles</Text>
                                    </View>
                                    <View style={{ flex: 0.35 }}></View>
                                    <View style={{ flex: 0.25, margin: 5 }}>
                                        <CheckBox onPress={() => {
                                            this.setState({ getAll: !this.state.getAll })

                                        }} checked={this.state.getAll} color="#262261" /></View>
                                </View>
                                <Row style={{ height: 20 }}></Row>
                                <View style={{ flex: 1, flexDirection: "row", marginLeft: 10, marginTop: 5 }}>
                                    <View style={{ flex: 0.4 }}>
                                        <Button style={{ borderRadius: 10, backgroundColor: "#262261" }}
                                            onPress={this.handleCancelSearchModal}>
                                            <Text style={{ color: "white" }}>cancel</Text>
                                        </Button></View>
                                    <View style={{ flex: 0.2 }}></View>
                                    <View style={{ flex: 0.4 }}>
                                        <Button onPress={this.submitSearchCycle} style={{ borderRadius: 10, backgroundColor: "#262261" }}>
                                            <Text style={{ color: "white" }}>
                                                Search
                                            </Text>
                                        </Button></View>
                                </View>


                            </Grid>
                        </Content>
                    </Container>

                </Modal>

                <Modal backButtonClose={true} style={[styles.modal, styles.modal3]} position={"center"} ref={"modalMonths"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled} onOpened={this.openMonthsModal}>
                    <Container>
                        <Content>
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

                <Modal backButtonClose={true} style={[styles.modal, styles.modal3]} position={"center"} ref={"modal2"} swipeToClose={false}
                    isDisabled={this.state.isDisabled} onOpened={this.openCyclesModal}>
                    <Container>
                        <Content>
                            {this.state.renderedCycles}
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

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={(date) => {
                        this._handleDatePicked(date)
                    }}
                    onCancel={this._hideDateTimePicker}
                />



            </Container>
        );
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
        height: "90%",
        width: "85%",
        borderRadius: 12,
    },
    modalJoin: {
        height: "80%",
        width: "85%",
        borderRadius: 12,

    },
    modalProfile: {
        height: "38%",
        width: "85%",
        borderRadius: 12,
    }
});


export default CyclesHome;