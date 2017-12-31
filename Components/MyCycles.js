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

import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { ProgressDialog } from 'react-native-simple-dialogs';

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
            progressVisible: false
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

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);

        this.setState({ progressVisible: true })
        let renderedCycles = []
        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetCyclesCreatedByMe",
            data: JSON.stringify({ id: this.props.navigation.state.params.userid }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({ progressVisible: false });
                console.log(resp)
                const { navigate } = this.props.navigation;

                if (resp.data.cycles.length > 0) {
                    for (let x = 0; x < resp.data.cycles.length; x++) {
                        renderedCycles.push(
                            <Card key={x}>
                                <CardItem header>
                                    <Text style={{ fontSize: 25 }}>cycle : {resp.data.cycles[x].cyclE_NAME}</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Text>
                                            startDate : {resp.data.cycles[x].startDate}
                                        </Text>
                                        <Text>endDate : {resp.data.cycles[x].endDate}</Text>
                                        <Text>Number of members : {resp.data.cycles[x].numbeR_OF_MEMBERS}</Text>
                                        <Text>amount : {resp.data.cycles[x].totaL_AMOUNT}</Text>
                                    </Body>
                                </CardItem>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <TouchableHighlight style={{ backgroundColor: "#262261", width: "40%", height: 40, alignItems: "center", justifyContent: "center", borderRadius: 12 }} onPress={() => {
                                        navigate("CycleMembers", { cycleid: resp.data.cycles[x], userid: this.props.navigation.state.params.userid });

                                    }}>
                                        <View>
                                            <Text style={{ color: "white" }}>show cycle</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </Card>
                        )
                    }
                    this.setState({ renderedCycles: renderedCycles }, () => {

                        this.setState({ progressVisible: false }, () => {
                            if (this.props.navigation.state.params.option === "create") {

                                navigate("CycleMembers", { cycleid: resp.data.cycles[resp.data.cycles.length - 1], userid: this.props.navigation.state.params.userid });
                            }
                        });

                    })
                }

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

                    </Header>

                    <ProgressDialog
                        visible={this.state.progressVisible}
                        title="My Cycles"
                        message="Please, wait..."
                    />

                    {this.state.renderedCycles}

                </Content>

                <Modal backButtonClose={true}   style={[styles.modal, styles.modal3]} position={"center"} ref={"ModalMembers"}
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

                <Modal backButtonClose={true}   style={[styles.modal, styles.modalProfile]} position={"center"} ref={"ModalProfile"}
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