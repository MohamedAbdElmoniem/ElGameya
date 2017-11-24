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

export default class AllCycles extends Component {
    constructor(props) {
        super(props)
        this.state = {
            renderedCycles: [],
            progressVisible: false
        }
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

        if (this.state.returnedCycles.length > 0) {
            for (let x = 0; x < this.state.returnedCycles.length; x++) {
                renderedListOfCycles.push(
                    <Card key={x}>
                        <CardItem header>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Cycle : {this.state.returnedCycles[x].cyclE_NAME}</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>Start Date : {this.state.returnedCycles[x].startDate}</Text>
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


    render() {

        const {navigate } = this.props.navigation;

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
                            <Title>My Cycles</Title>
                        </Body>
                    </Header>
                    {this.state.renderedCycles}
                </Content>
            </Container>
        )
    }
}