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

export default class MyProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progressVisible: false,
            isEditProfileTurnedOn: false,
            renderedProfile: [],
            userData: {},
            full_name: "",
            email: "",
            mobile: ""
        }

        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        this.renderUserProfile = this.renderUserProfile.bind(this);
        this.handleGettingUserData = this.handleGettingUserData.bind(this);
        this.handleSaveEditedData = this.handleSaveEditedData.bind(this);
    }

    componentWillMount() {
        this.handleGettingUserData();
    }

    handleGettingUserData = () => {
        let component = this;
        let id = component.props.navigation.state.params.userid
        this.setState({ progressVisible: true });
        let data = {
            Id: id
        }

        // join in specific month of cycle
        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetUserData",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                let responseData = resp.data;
                this.setState({
                    userData: resp.data.userData, progressVisible: false,
                    full_name: resp.data.userData.full_name, email: resp.data.userData.email, mobile: resp.data.userData.mobile
                }, () => {
                    this.renderUserProfile()
                });

            })
            .catch((err) => {
                console.log(err)
                component.setState({ progressVisible: false }, () => {
                    alert("Can't get user profile .. server error");
                })
            })
    }

    renderUserProfile = () => {
        let renderedUser = [];
        if (this.state.isEditProfileTurnedOn === false) {
            renderedUser.push(
                <List>
                    <ListItem key={0} icon>
                        <Left>
                            <Icon name="md-person" />
                        </Left>
                        <Body>
                            <Text>Name : {this.state.userData.full_name}</Text>
                        </Body>
                    </ListItem>
                    <ListItem key={1} icon>
                        <Left>
                            <Icon name="md-mail" />
                        </Left>
                        <Body>
                            <Text>Email : {this.state.userData.email}</Text>
                        </Body>
                    </ListItem>
                    <ListItem key={2} icon>
                        <Left>
                            <Icon name="md-phone-portrait" />
                        </Left>
                        <Body>
                            <Text>Phone : {this.state.userData.mobile}</Text>
                        </Body>
                    </ListItem>
                </List>
            )
            this.setState({ renderedProfile: renderedUser })
        }
        else {
            renderedUser.push(
                <Grid>
                    <Row>
                        <Col>
                            <Form>
                                <Item floatingLabel>
                                    <Label>Name</Label>
                                    <Input value={this.state.full_name.toString()} onChangeText={(text) => {
                                        this.setState({ full_name: text }, () => {
                                            this.renderUserProfile()
                                            this.state.userData.full_name = text;
                                        })

                                    }} />
                                </Item>
                                <Item floatingLabel last>
                                    <Label>Mobile</Label>
                                    <Input value={this.state.mobile.toString()} onChangeText={(text) => {
                                        this.setState({ mobile: text }, () => {
                                            this.renderUserProfile();
                                            this.state.userData.mobile = text;
                                        })

                                    }} />
                                </Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                        <Col style={{ width: "60%" }}></Col>
                        <Col style={{ width: "40%" }}>
                            <Button block style={{ backgroundColor: "#262261", borderRadius: 10, marginRight: 10 }} onPress={() => {
                                this.handleSaveEditedData()
                            }}>
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "white", fontSize: 15 }}>Save</Text>
                                </View>
                            </Button>
                        </Col>
                    </Row>
                </Grid>

            )
            this.setState({ renderedProfile: renderedUser })

        }

    }

    handleSaveEditedData() {
        let component = this;
        let id = component.props.navigation.state.params.userid
        this.setState({ progressVisible: true });
        let cycle = {
            id: this.state.userData.id,
            full_name: this.state.full_name,
            mobile: this.state.mobile
        }

        // join in specific month of cycle
        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/UpdateUserData",
            data: JSON.stringify(cycle),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                let responseData = resp.data;
                this.setState({ progressVisible: false }, () => {
                    alert("Data Updated Successfully")
                })


            })
            .catch((err) => {
                console.log(err)
                component.setState({ progressVisible: false }, () => {
                    alert("Can't Update user profile .. server error");
                })
            })
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
                            <Title>My Profile</Title>
                        </Body>
                        <Right>
                            <TouchableOpacity onPress={() => {
                                this.setState({ isEditProfileTurnedOn: !this.state.isEditProfileTurnedOn }, () => {
                                    this.renderUserProfile();
                                })
                            }} >
                                <Icon name='md-build' style={{ color: "white" }} />
                            </TouchableOpacity>

                        </Right>
                    </Header>
                    {this.state.renderedProfile}
                </Content>
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
