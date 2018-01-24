/**
 * Created by abdelmon on 8/2/2017.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    AsyncStorage, Image, TouchableHighlight

} from 'react-native';
import {
    Button,
    Grid,
    Col,
    Row,
    Form,
} from 'native-base'
import axios from 'axios'
import { StackNavigator } from 'react-navigation';
import {
    Container,
    Header,
    Content,
    Input,
    Body,
    Title,
    Item,
    StyleProvider,
    Card,
    CardItem,
    Icon,
    Right
} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { BackHandler } from 'react-native'
const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    AccessToken,GraphRequestManager,GraphRequest
} = FBSDK;

export default class LoginComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            visible: false,
            progressVisible: false
        };

        this.handleLoginPress = this.handleLoginPress.bind(this);
    }

    static navigationOptions = {
        title: "Login",
        header: null
    }

    handleLoginPress() {
        const { navigate } = this.props.navigation;

        if (this.state.email == "" || this.state.password == "") {
            alert("please enter all fields");
        }
        else {
            this.setState({ progressVisible: true })

            let userData = {}
            this.setState({ progressVisible: true })
            userData =
                {
                    email: this.state.email,
                    password: this.state.password,
                }
            console.log(JSON.stringify(userData))

            axios({
                method: "POST",
                url: "http://www.elgameya.net/api/gamieya/LoginUser",
                data: JSON.stringify(userData),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((resp) => {
                    this.setState({ progressVisible: false });
                    console.log(resp)
                    let adminId = resp.data.id.toString();
                    AsyncStorage.setItem('adminId', adminId, () => {
                        navigate("HomePage", resp.data);

                    });


                })
                .catch((err) => {
                    this.setState({ progressVisible: false },()=>
                    {
                        alert("Unexpected error");                        
                    });

                })


        }


    }

    componentWillMount() {
        const { navigate } = this.props.navigation;

        if (this.props.navigation.state.params) {
            if (this.props.navigation.state.params.email) {
                this.setState({ email: this.props.navigation.state.params.email, password: this.props.navigation.state.params.password })

            }
        }

        
    }



    componentDidMount() {

    }

    componentWillUnmount() {
    }



    initUser(token) {
        const { navigate } = this.props.navigation;
        this.setState({ progressVisible: true });
        fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
        .then((response) => response.json())
            .then((json) => {
             


                let FbCredentials = { Name: json.name, Email: json.email }
                ;
                axios({
                    method: "POST",
                    url: "http://www.elgameya.net/api/gamieya/RegisterLoginFacebook",
                    data: JSON.stringify(FbCredentials),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then((resp) => {
                        this.setState({ progressVisible: false });
                        console.log(resp)
                        ;
                        let adminId = resp.data.user.id.toString();
                        AsyncStorage.setItem('adminId', adminId, () => {
                            navigate("HomePage", resp.data.user);

                        });


                    })
                    .catch((err) => {
                        this.setState({ progressVisible: false },()=>{
                            alert("Unexpected error");                            
                        });

                    })



                console.log(json);
            })
            .catch(() => {
                reject('ERROR GETTING DATA FROM FACEBOOK')
            })
    }


    render() {

        return (
            <Container>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title="ElGameya"
                    message="Please, wait..."
                />
                <Content>
                    <Header style={{ backgroundColor: "#9E1F64" }}>
                        <Body>
                            <Title>ElGameya</Title>
                        </Body>
                    </Header>
                    <Grid>
                        <Row style={{ height: 20 }}></Row>
                        <View style={{ height: "10%", marginLeft: 5, justifyContent: "center", marginTop: 5, alignItems: "center", flex: 1, marginBottom: 5 }}>
                            <View>
                                <Text style={{ fontWeight: "bold", color: "#9E1F64", fontSize: 20 }}>WELCOME TO</Text>
                            </View>
                        </View>
                        <Row>
                            <Col style={{ alignItems: "center" }}>
                                <Image style={{ height: 55, width: 180, resizeMode: "stretch" }}
                                    source={require('../imgs/gamieya.png')}
                                /></Col>
                        </Row>
                        <Row style={{ height: 20 }}></Row>
                        <Row>
                            <Col style={styles.colWidth}></Col>
                            <Col style={styles.colBigWidth}>

                                <Form>
                                    <Item>
                                        <Input value={this.state.email}
                                            onChangeText={(text) => {
                                                this.setState({ email: text })
                                            }}
                                            placeholder="email" />
                                    </Item>
                                    <Item>
                                        <Input value={this.state.password}
                                            onChangeText={(text) => {
                                                this.setState({ password: text })
                                            }}
                                            secureTextEntry={true}
                                            placeholder="password" />
                                    </Item>
                                </Form>


                            </Col>
                            <Col style={styles.colWidth}></Col>
                        </Row>
                        <Row style={{ height: 20 }}></Row>
                        <Row>
                            <Col style={styles.colWidth}></Col>
                            <Col style={styles.colBigWidthButtons}>
                                <TouchableHighlight onPress={this.handleLoginPress}>
                                    <Grid style={styles.buttonLogin}>
                                        <Row>
                                            <Col></Col>
                                            <Col><Text style={styles.textColor}>Login</Text>
                                            </Col>
                                            <Col></Col>
                                        </Row>
                                    </Grid>
                                </TouchableHighlight>
                            </Col>
                            <Col style={styles.colWidth}></Col>
                        </Row>
                        <Text>
                            {"\n"}
                        </Text>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <LoginButton
                                ref="fbsdk"
                                readPermissions={["email", "user_friends", "public_profile"]}
                                onLoginFinished={
                                    (error, result) => {
                                        if (error) {
                                            alert("login has error: " + result.error);
                                        } else if (result.isCancelled) {
                                            alert("login is cancelled.");
                                        } else {
                                            AccessToken.getCurrentAccessToken().then(
                                                (data) => {
                                                   this.initUser(data.accessToken.toString());
                                               
                                                }
                                            )
                                        }
                                    }
                                }
                            />
                        </View>
                        <Text>
                            {"\n"}
                        </Text>
                        <Row>
                            <Col style={styles.colWidth}></Col>
                            <Col style={styles.colBigWidthButtons}>
                                <TouchableHighlight onPress={() => {
                                    const { navigate } = this.props.navigation;
                                    navigate("RegisterationPage");
                                }}>
                                    <Grid style={styles.buttonLogin}>
                                        <Row>
                                            <Col></Col>
                                            <Col><Text style={styles.textColor}>Signup</Text>
                                            </Col>
                                            <Col></Col>
                                        </Row>
                                    </Grid>
                                </TouchableHighlight>
                            </Col>
                            <Col style={styles.colWidth}></Col>
                        </Row>
                    </Grid>




                </Content>
            </Container>
        )
    }

}


const styles = StyleSheet.create({
    header: {
        backgroundColor: '#F5FCFF'
    },
    colWidth: {
        flex: 0.15
    },
    colBigWidth: {
        flex: 0.7,
        borderRadius: 2,
        borderWidth: 0.8,
        borderColor: "black"
    },
    colBigWidthButtons: {
        flex: 0.7

    },
    buttonSignUp: {
        backgroundColor: "#262261",
        borderRadius: 5,

        height: 50,
    },
    buttonLogin: {
        backgroundColor: "#262261",
        borderRadius: 5,

        height: 50,
    },
    textColor: {
        color: "white",
        textAlign: 'center',
        marginTop: 12,
        fontSize: 15
    }
});
