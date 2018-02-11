/**
 * Created by abdelmon on 8/20/2017.
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
    TouchableOpacity, Switch, AsyncStorage, TouchableHighlight, BackHandler
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
    Row, Tabs, Tab, TabHeading,
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
import { config } from './Config/Config'
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { ProgressDialog } from 'react-native-simple-dialogs';
import Accordion from 'react-native-collapsible/Accordion';
var moment = require('moment');
export default class MyCycles extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            renderedCycles: [],
            renderedMembers: [],
            renderedUserProfile: [],
            starCount: 0,
            profileResponse: {},
            showData: false,
            currentCycleId: "",
            RATEDUSERID: "",
            progressVisible: false,
            renderedCycles: [
                [], [], []
            ]
        };
        this.handleBackButton = this.handleBackButton.bind(this);

    }

    onReceived(notification) {
        console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
        OneSignal.sendTag("key", "value");

    }

    onRegistered(notifData) {
        console.log("Device had been registered for push notifications!", notifData);
    }

    onIds(device) {
        console.log('Device info: ', device);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('registered', this.onRegistered);
        OneSignal.removeEventListener('ids', this.onIds);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);

    }

    componentWillMount() {
        this.state.tabheading1 = <TabHeading style={{ flex: 1, backgroundColor: "yellow" }}>
        <View style={{ flex: 1, backgroundColor: "yellow" }}>
            <Text>fsdfsdfsdfsdf</Text>
        </View>
    </TabHeading>
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);
        let header = [];
        let content = [];

        this.setState({ progressVisible: true })
        let renderedCycles = []
        axios({
            method: "POST",
            url: config.GetAllMyCycles,
            data: JSON.stringify({ Id: this.props.navigation.state.params.userid }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {

                this.setState({ progressVisible: false });
                console.log(resp)
                const { navigate } = this.props.navigation;

                if (resp.data.status == "success") {
                    if (resp.data.activeCycles.length > 0) {
                        let currentData = resp.data.activeCycles;

                        for (let x = 0; x < resp.data.activeCycles.length; x++) {

                            let endData = moment(currentData[x].endDate);
                            let formatedEndDate = endData.format("MMMM") + ", " + endData.format("YYYY")

                            this.state.renderedCycles[0].push(
                                <View key={x} style={{ marginBottom: 20 }}>
                                    <Accordion
                                        sections={['Section' + x]}
                                        renderHeader={() => {
                                            return <View style={{ flex: 1, backgroundColor: "white" }}>
                                                <View style={{ flex: 0.2 }}>
                                                </View>
                                                <View style={{ flex: 0.6, backgroundColor: "white", borderRadius: 10, borderWidth: 0.5 }}>
                                                    <Text style={{ fontWeight: "bold", color: "#9E1F64", marginLeft: 5 }}>{currentData[x].cyclE_NAME}</Text>
                                                </View>
                                                <View style={{ flex: 0.2 }}>
                                                </View>
                                            </View>
                                        }}
                                        renderContent={() => {
                                            return <TouchableOpacity>
                                                <Grid style={{ backgroundColor: "gray", borderRadius: 10 }}>
                                                    <Row>
                                                        <Col style={{ width: "5%" }}></Col>
                                                        <Col style={{ width: "70%" }}>
                                                            <Row>
                                                                <Col><Text style={{ color: "white", fontSize: 12 }}>Ends on {formatedEndDate}</Text></Col>
                                                            </Row>
                                                            <Row>
                                                                <Col><Text style={{ color: "white", fontSize: 12 }}>Total amount is {currentData[x].totaL_AMOUNT} LE</Text></Col>
                                                            </Row>
                                                            <Row>
                                                                <Col><Text style={{ color: "white", fontSize: 12 }}>{currentData[x].numbeR_OF_MEMBERS} Members</Text></Col>
                                                            </Row>
                                                        </Col>
                                                        <Col style={{ width: "25%" }}></Col>
                                                    </Row>
                                                </Grid>
                                            </TouchableOpacity>
                                        }}
                                    />
                                </View>
                            )
                        }

                    }
                    else {

                    }
                    if (resp.data.notStartedCycles.length > 0) {
                        let currentData = resp.data.notStartedCycles;

                        for (let x = 0; x < resp.data.notStartedCycles.length; x++) {

                            let endData = moment(currentData[x].endDate);
                            let formatedEndDate = endData.format("MMMM") + ", " + endData.format("YYYY")

                            this.state.renderedCycles[1].push(
                                <View key={x} style={{ marginBottom: 20 }}>
                                    <Accordion
                                        sections={['Section' + x]}
                                        renderHeader={() => {
                                            return <View style={{ flex: 1, backgroundColor: "white" }}>
                                                <View style={{ flex: 0.2 }}>
                                                </View>
                                                <View style={{ flex: 0.6, backgroundColor: "white", borderRadius: 10, borderWidth: 0.5 }}>
                                                    <Text style={{ fontWeight: "bold", color: "#9E1F64", marginLeft: 5 }}>{currentData[x].cyclE_NAME}</Text>
                                                </View>
                                                <View style={{ flex: 0.2 }}>
                                                </View>
                                            </View>
                                        }}
                                        renderContent={() => {
                                            return <TouchableOpacity>
                                                <Grid style={{ backgroundColor: "gray", borderRadius: 10 }}>
                                                    <Row>
                                                        <Col style={{ width: "5%" }}></Col>
                                                        <Col style={{ width: "70%" }}>
                                                            <Row>
                                                                <Col><Text style={{ color: "white", fontSize: 12 }}>Ends on {formatedEndDate}</Text></Col>
                                                            </Row>
                                                            <Row>
                                                                <Col><Text style={{ color: "white", fontSize: 12 }}>Total amount is {currentData[x].totaL_AMOUNT} LE</Text></Col>
                                                            </Row>
                                                            <Row>
                                                                <Col><Text style={{ color: "white", fontSize: 12 }}>{currentData[x].numbeR_OF_MEMBERS} Members</Text></Col>
                                                            </Row>
                                                        </Col>
                                                        <Col style={{ width: "25%" }}></Col>
                                                    </Row>
                                                </Grid>
                                            </TouchableOpacity>
                                        }}
                                    />
                                </View>
                            )
                        }
                    }
                    else {

                    }
                    if (resp.data.completedCycles.length > 0) {
                        let currentData = resp.data.completedCycles;

                        for (let x = 0; x < resp.data.completedCycles.length; x++) {

                            let endData = moment(currentData[x].endDate);
                            let formatedEndDate = endData.format("MMMM") + ", " + endData.format("YYYY")

                            this.state.renderedCycles[2].push(
                                <View key={x} style={{ marginBottom: 20 }}>
                                    <Accordion
                                        sections={['Section' + x]}
                                        renderHeader={() => {
                                            return <View style={{ flex: 1, backgroundColor: "white" }}>
                                                <View style={{ flex: 0.2 }}>
                                                </View>
                                                <View style={{ flex: 0.6, backgroundColor: "white", borderRadius: 10, borderWidth: 0.5 }}>
                                                    <Text style={{ fontWeight: "bold", color: "#9E1F64", marginLeft: 5 }}>{currentData[x].cyclE_NAME}</Text>
                                                </View>
                                                <View style={{ flex: 0.2 }}>
                                                </View>
                                            </View>
                                        }}
                                        renderContent={() => {
                                            return <TouchableOpacity>
                                                <Grid style={{ backgroundColor: "gray", borderRadius: 10 }}>
                                                    <Row>
                                                        <Col style={{ width: "5%" }}></Col>
                                                        <Col style={{ width: "70%" }}>
                                                            <Row>
                                                                <Col><Text style={{ color: "white", fontSize: 12 }}>Ends on {formatedEndDate}</Text></Col>
                                                            </Row>
                                                            <Row>
                                                                <Col><Text style={{ color: "white", fontSize: 12 }}>Total amount is {currentData[x].totaL_AMOUNT} LE</Text></Col>
                                                            </Row>
                                                            <Row>
                                                                <Col><Text style={{ color: "white", fontSize: 12 }}>{currentData[x].numbeR_OF_MEMBERS} Members</Text></Col>
                                                            </Row>
                                                        </Col>
                                                        <Col style={{ width: "25%" }}></Col>
                                                    </Row>
                                                </Grid>
                                            </TouchableOpacity>
                                        }}
                                    />
                                </View>
                            )
                        }
                    }
                    else {

                    }


                }
                this.setState({})

            })
            .catch((err) => {

                this.setState({ progressVisible: false }, () => {
                    alert("Unexpected error");
                });

            })
    }

    showMembers = (cycleid) => {
        this.setState({ visible: true })

        let renderedMembers = []
        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetCycleMembers",
            data: JSON.stringify({ User_id: this.props.navigation.state.params.userid, Cycle_id: cycleid }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ visible: false });
                console.log(resp)


                if (resp.data.users.length > 0) {
                    for (let x = 0; x < resp.data.users.length; x++) {
                        renderedMembers.push(
                            <ListItem avatar key={x}>
                                <Grid>
                                    <Row>
                                        <Col><Text>Name : {resp.data.users[x].full_name}</Text>
                                        </Col>
                                        <Col></Col>
                                        <Col><Button small onPress={() => {
                                            this.refs.ModalMembers.close();
                                            this.showUserProfile(resp.data.users[x].id, cycleid);
                                        }}><Text>show profile</Text></Button></Col>
                                    </Row>
                                </Grid>

                            </ListItem>
                        )
                    }
                    this.setState({ renderedMembers: renderedMembers }, () => {
                        this.refs.ModalMembers.open();
                    })
                }

            })
            .catch((err) => {
                alert("Unexpected error");
                this.setState({ visible: false });

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
                this.setState({ profileResponse: response }, () => {
                    this.setState({ showData: true })
                });
                // this.setState({renderedUserProfile: renderedProfile});

            })
            .catch((err) => {
                alert("Unexpected error");
                this.setState({ visible: false });

            })


        this.refs.ModalProfile.open();

    }

    handleBackButton() {
        let component = this;
        const { navigate } = component.props.navigation;
        navigate("HomePage", { id: component.props.navigation.state.params.userid });
    }




    componentDidMount() {

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    renderProfileData(response) {
        return (
            <Card key={0}>

                <CardItem>
                    <Body>
                        <Text>name : {response.user.full_name}</Text>
                        <Text>email : {response.user.email}</Text>
                        <Text>phone : {response.user.mobile}</Text>
                        <Text>total rate : {response.ratesTotal}</Text>

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



    render() {
        debugger;
        const { navigate } = this.props.navigation;
     

        return (
            <Container>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

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
                            <Title>My Cycles</Title>
                        </Body>
                        <Right>

                        </Right>
                    </Header>

                    <ProgressDialog
                        visible={this.state.progressVisible}
                        title="My Cycles"
                        message="Please, wait..."
                    />



                    <Tabs style={{ height: "100%" }} ref={(tabsref)=>{
                        this.tabsref=tabsref;
                    }} onChangeTab={(i, ref) => {

                        this.setState({tabheading1:
                            (<TabHeading style={{ flex: 1, backgroundColor: "yellow" }}>
                            <View style={{ flex: 1, backgroundColor: "yellow" }}>
                                <Text>ffffffffffffff</Text>
                            </View>
                        </TabHeading>
                            )
                        })
                        debugger;
          
                    }}>
                        <Tab heading={this.state.tabheading1} style={{ height: "100%" }}>
                            <Grid style={{ height: "100%", marginTop: 20 }}>
                                <Row>
                                    <Col style={{ width: "10%" }}></Col>
                                    <Col style={{ width: "80%" }}>
                                        {this.state.renderedCycles[0]}
                                    </Col>
                                    <Col style={{ width: "10%" }}></Col>
                                </Row>
                            </Grid>
                        </Tab>
                        <Tab heading="Not started" style={{ height: "100%" }}>
                            <Grid style={{ height: "100%", marginTop: 20 }}>
                                <Row>
                                    <Col style={{ width: "10%" }}></Col>
                                    <Col style={{ width: "80%" }}>
                                        {this.state.renderedCycles[1]}
                                    </Col>
                                    <Col style={{ width: "10%" }}></Col>
                                </Row>
                            </Grid>
                        </Tab>
                        <Tab heading="Completd" style={{ height: "100%" }}>
                            <Grid style={{ height: "100%", marginTop: 20 }}>
                                <Row>
                                    <Col style={{ width: "10%" }}></Col>
                                    <Col style={{ width: "80%" }}>
                                        {this.state.renderedCycles[2]}
                                    </Col>
                                    <Col style={{ width: "10%" }}></Col>
                                </Row>
                            </Grid>
                        </Tab>
                    </Tabs>

                </Content>

                <Modal backButtonClose={true} style={[styles.modal, styles.modal3]} position={"center"} ref={"ModalMembers"}
                    swipeToClose={false}
                    isDisabled={this.state.isDisabled}>
                    <Container>
                        <Content>
                            <List>
                                {this.state.renderedMembers}
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

                <Toast ref="toast"
                    fadeInDuration={750}
                    fadeOutDuration={1500}
                    position='center'
                />

            </Container >
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
        width: "85%"
    },
    modalProfile: {
        height: "40%",
        width: "85%"
    },

    textBorder: {
        borderColor: 'black',
        borderWidth: 1
    }

});