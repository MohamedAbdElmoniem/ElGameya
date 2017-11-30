/**
 * Created by abdelmon on 8/2/2017.
 */


import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text, Image,
    View,
    TouchableHighlight, AsyncStorage
} from 'react-native';
import { Button } from 'native-base'
import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Grid,
    Col,
    Row,
    ListItem,
    Right,
    CheckBox,
    Form,
    Item,
    Input,
    Icon,
    Title,
    StyleProvider
} from 'native-base';

import axios from 'axios'
import PageOne from './LoginComponent'
import Spinner from 'react-native-loading-spinner-overlay';

export default class RegisterationComponent extends Component {

    static navigationOptions = {
        title: "ElGameya",
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            fullname: "",
            email: "",
            password: "",
            mobile: "",
            Terms: false
        }
        this.handleSignUpClick = this.handleSignUpClick.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
    }



    handleSignUpClick() {

        if (this.state.fullname == "" || this.state.email == "" || this.state.mobile == "" || this.state.password == "") {
            alert("please enter all fields")
        }
        else {

            if (this.state.Terms === false) {
                alert("please check terms and conditions")
            }
            else {

                if (this.state.email.match(/\S+@\S+\.\S+/)) {

                    let userData = {}
                    this.setState({ visible: true })
                    userData =
                        {
                            full_name: this.state.fullname,
                            email: this.state.email,
                            password: this.state.password,
                            mobile: this.state.mobile
                        }
                    console.log(JSON.stringify(userData))

                    axios({
                        method: "POST",
                        url: "http://www.gameya.somee.com/api/gamieya/RegisterUser",
                        data: JSON.stringify(userData),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                        .then((resp) => {
                            this.setState({ visible: false });
                            console.log(resp)
                            const { navigate } = this.props.navigation;
                            navigate("LoginPage",{email:this.state.email,password:this.state.password});
                        })
                        .catch((err) => {
                            console.log(err)
                            this.setState({ visible: false },()=>{
                                alert("Unexpected error");                                
                            });

                        })

                }
                else {
                    alert("Email format is wrong")
                }


            }
        }
    }

    handleLoginClick() {
        const { navigate } = this.props.navigation;
        navigate("LoginPage");
    }

    render() {


        return (
                <Container>
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

                    <Content>
                        <Header style={{ backgroundColor: "#9E1F64" }}>
                            <Body>
                            </Body>
                        </Header>
                        <Grid>
                            <Row style={{ height: 6 }}></Row>
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
                                            <Input value={this.state.fullname}
                                                onChangeText={(text) => {
                                                    text = text.replace(/[^a-zA-Z]/g, '');
                                                    this.setState({ fullname: text })
                                                }}
                                                placeholder="Full name" />
                                        </Item>
                                        <Item last>
                                            <Input
                                                value={this.state.email}
                                                onChangeText={(text) => {

                                                    this.setState({ email: text })
                                                }}
                                                placeholder="E-mail" />
                                        </Item>
                                        <Item last>
                                            <Input
                                                value={this.state.password}
                                                onChangeText={(text) => {
                                                    this.setState({ password: text })
                                                }}
                                                secureTextEntry={true}
                                                placeholder="Password" />
                                        </Item>
                                        <Item last>
                                            <Input
                                                value={this.state.mobile}
                                                onChangeText={(text) => {
                                                    text = text.replace(/[^0-9]/g, '');
                                                    this.setState({ mobile: text })
                                                }}
                                                placeholder="Mobile" />
                                        </Item>
                                    </Form>
                                </Col>
                                <Col style={styles.colWidth}></Col>
                            </Row>
                            <Row>
                                <Col style={styles.colWidth}></Col>
                                <Col style={styles.colBigWidthButtons}>
                                    <ListItem>
                                        <CheckBox onPress={() => {
                                            this.setState({ Terms: !this.state.Terms })

                                        }} checked={this.state.Terms} color="#262261" />
                                        <Body>
                                            <Text style={{ marginLeft: 8, fontSize: 12 }}>I agree on terms and conditions</Text>
                                        </Body>
                                    </ListItem>
                                </Col>
                                <Col style={styles.colWidth}>
                                </Col>
                            </Row>
                            <Row style={{ height: 20 }}></Row>
                            <Row >
                                <Col style={styles.colWidth}></Col>
                                <Col style={styles.colBigWidthButtons}>

                                    <TouchableHighlight onPress={this.handleSignUpClick}>
                                        <Grid style={styles.buttonSignUp}>
                                            <Row>
                                                <Col></Col>
                                                <Col><Text style={styles.textColor}>sign up</Text>
                                                </Col>
                                                <Col></Col>
                                            </Row>
                                        </Grid>
                                    </TouchableHighlight>
                                </Col>
                                <Col style={styles.colWidth}></Col>
                            </Row>
                            <Row style={{ height: 20 }}></Row>
                            <Row >
                                <Col style={styles.colWidth}></Col>
                                <Col style={styles.colBigWidthButtons}>

                                    <TouchableHighlight onPress={this.handleLoginClick}>
                                        <Grid style={styles.buttonLogin}>
                                            <Row>
                                                <Col></Col>
                                                <Col><Text style={styles.textColor}>login</Text>
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
