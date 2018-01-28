/**
 * Created by abdelmon on 9/9/2017.
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
    TouchableOpacity, Switch, AsyncStorage
} from 'react-native';
import {Button} from 'native-base';
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
import Toast, {DURATION} from 'react-native-easy-toast'
import OneSignal from 'react-native-onesignal'; // Import package from node modules

import PopupDialog, {SlideAnimation} from 'react-native-popup-dialog';
import {ProgressDialog} from 'react-native-simple-dialogs';



export default class Following extends Component {


    static navigationOptions = {
        header: null,
        drawerLabel:"Following"
    }

    constructor(props) {
        super(props);
        this.state = {

            progressVisible: false,
            followers: [],
            showData:false,
            starCount:0
        };
        this.currentUserId = "";

    }


    reloadFollowing()
    {
        this.setState({progressVisible: true,followers:[]});

        AsyncStorage.getItem('adminId', (err, result) => {
            this.currentUserId = result;

        let userData = {
            id: this.currentUserId
        }
        let followersArray = [];

        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetFollowedByMe",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                console.log(resp);

                let followers = resp.data.followedByMe;
                for (let x = 0; x < followers.length; x++) {
                    followersArray.push(<ListItem icon key={x} onPress={() => {
                        this.showUserProfile(followers[x].id);

                    }}>
                        <Left>
                            <Icon name="md-contact"/>
                        </Left>
                        <Body>
                        <Text>Name : {followers[x].full_name}</Text>
                        </Body>
                        <Right>
                            <Text>show</Text>
                            <Icon name="arrow-forward"/>
                        </Right>

                    </ListItem>)
                }

                this.setState({followers: followersArray, progressVisible: false});


            })
            .catch((err) => {
                alert("Unexpected error");
                this.setState({progressVisible: false});

            })
        })
    }

    componentWillMount() {
        this.setState({progressVisible: true});

        AsyncStorage.getItem('adminId', (err, result) => {
            this.currentUserId = result;

        let userData = {
            id: this.currentUserId
        }
        let followersArray = [];

        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetFollowedByMe",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                console.log(resp);

                let followers = resp.data.followedByMe;
                for (let x = 0; x < followers.length; x++) {
                    followersArray.push(<ListItem icon key={x} onPress={() => {
                        this.showUserProfile(followers[x].id);

                    }}>
                        <Left>
                            <Icon name="md-contact"/>
                        </Left>
                        <Body>
                        <Text>Name : {followers[x].full_name}</Text>
                        </Body>
                        <Right>
                            <Text>show</Text>
                            <Icon name="arrow-forward"/>
                        </Right>

                    </ListItem>)
                }

                this.setState({followers: followersArray, progressVisible: false});


            })
            .catch((err) => {
                alert("Unexpected error");
                this.setState({progressVisible: false});

            })
        })

    }

    showUserProfile = (userid) => {
        let renderedProfile = []
        let userData = {
            id: userid
        }

        this.setState({ RATEDUSERID: userid,starCount: 0})


        this.setState({progressVisible: true})

        axios({
            method: "POST",
            url: "http://www.elgameya.net/api/gamieya/GetUserProfile",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                this.setState({progressVisible: false});
                console.log(resp)
                let response = resp.data;
                this.setState({profileResponse: response}, () => {
                    this.setState({showData: true},()=>{
                        this.refs.ModalProfile.open();

                    })
                });
                // this.setState({renderedUserProfile: renderedProfile});

            })
            .catch((err) => {
                alert("Unexpected error");
                this.setState({progressVisible: false});

            })



    }

    onStarRatingPress = (rate) => {

        this.setState({starCount: rate});
        this.setState({progressVisible: true});


        AsyncStorage.getItem('adminId', (err, result) => {
            this.currentUserId = result;

        let RateData = {
            USER_ID_RATED: this.state.RATEDUSERID,
            USER_ID_RATER:   this.currentUserId,
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
                this.setState({progressVisible: false});

                alert("User Rated Successfully");

                // this.setState({renderedUserProfile: renderedProfile});

            })
            .catch((err) => {
                alert("Unexpected error");
                this.setState({visible: false});

            })
        })

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
                    <Button small onPress={()=>{
                        this.UnfollowUser(response.user.id);
                    }}><Text>Unfollow</Text></Button>

                    </Body>
                </CardItem>

            </Card>
        )
    }

    UnfollowUser=(profileuserid)=>{

        this.setState({progressVisible:true})

        AsyncStorage.getItem('adminId', (err, result) => {
            this.currentUserId = result;

        let userData={
            Userid:this.currentUserId,
            Followerid:profileuserid
            
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

            ;
                this.setState({progressVisible: false});
                console.log(resp)
              this.refs.ModalProfile.close();
                this.reloadFollowing();

            })
            .catch((err) => {
                alert("Unexpected error");
                this.setState({progressVisible: false});

            })
        })
    }


    render() {
        const {navigate} = this.props.navigation;


        return (
            <Container>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}}/>
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title="ElGameya"
                    message="Please, wait..."
                />
                <Content>
                <Header style={{backgroundColor:"#9E1F64"}}>
                <Left>
                            <Icon style={{color:"white"}} name="menu" onPress={()=>{
                                this.props.navigation.navigate('DrawerOpen'); // open drawer
                            }} />
                        </Left>
                        <Body>
                        <Title>Following</Title>
                        </Body>
                    </Header>

                    <List>
                        {this.state.followers}
                    </List>


                </Content>

                <Modal style={[styles.modal, styles.modalProfile]} position={"center"} ref={"ModalProfile"}
                       swipeToClose={false}
                       isDisabled={this.state.isDisabled}>
                    <Container>
                        <Content>
                            {this.state.showData ? this.renderProfileData(this.state.profileResponse) : null}
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