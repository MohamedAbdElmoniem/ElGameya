/**
 * Created by abdelmon on 9/11/2017.
 */

/**
 * Created by abdelmon on 9/9/2017.
 */
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Switch,
  AsyncStorage,
  Dimensions,
  Image
} from "react-native";
import { Button } from "native-base";
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Grid,
  Col,
  CheckBox,
  Row,
  Badge,
  Right,
  Form,
  Item,
  Input,
  Icon,
  Title,
  StyleProvider,
  List,
  ListItem,
  Card,
  CardItem
} from "native-base";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import Modal from "react-native-modalbox";
import StarRating from "react-native-star-rating";
import Toast, { DURATION } from "react-native-easy-toast";
import OneSignal from "react-native-onesignal"; // Import package from node modules

import PopupDialog, { SlideAnimation } from "react-native-popup-dialog";
import { ProgressDialog } from "react-native-simple-dialogs";
const window = Dimensions.get("window");

export default class Messages extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: "Messages",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="ios-chatboxes-outline" style={{ color: "white" }} />
    )
  };

  constructor(props) {
    super(props);
    this.state = {
      progressVisible: false,
      userMessages: [],
      message: "",
      chatBox: [],
      ReceiverId: "",
      ChatWith: ""
    };

    this.currentUserId = "";
    this.doInterval = "";
  }

  componentDidMount() {}

  componentWillMount() {
    AsyncStorage.getItem("adminId", (err, result) => {
      this.currentUserId = result;
      this.setState({ progressVisible: true });
      let userData = {
        ReceiverId: result
      };

      let followersArray = [];

      axios({
        method: "POST",
        url: "http://www.elgameya.net/api/gamieya/GetMyMessages",
        data: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(resp => {
          console.log(resp);

          let users = resp.data.userMessages;
          for (let x = 0; x < users.length; x++) {
            followersArray.push(
              <ListItem
                icon
                key={x}
                onPress={() => {
                  this.openModalMsg(users[x].id, users[x].full_name);
                }}
              >
                <Left>
                  <Icon name="md-contact" style={{ color: "black" }} />
                </Left>
                <Body>
                  <Text>{users[x].full_name}</Text>
                </Body>
                <Right>
                  <Badge success style={{ backgroundColor: "#262261" }}>
                    <Text style={{ color: "white" }}>open Chat</Text>
                  </Badge>
                </Right>
              </ListItem>
            );
          }
          if (users.length === 0) {
            followersArray.push(
              <View key={0}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={require("../imgs/chat.png")}
                  style={{
                    height: window.height * 70 / 100,
                    width: window.width * 85 / 100,
                    resizeMode: "contain"
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    marginTop:-30,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Button
                    small
                    rounded
                    style={{
                      backgroundColor: "#ACAAD0"
                    }}
                    onPress={() => {}}
                  >
                    <Text style={{ color: "#262261" }}>Start Chat</Text>
                  </Button>
                </View>
              </View>
            );
          }

          this.setState({
            userMessages: followersArray,
            progressVisible: false
          });
        })
        .catch(err => {
          alert("Can't load your messages");
          this.setState({ progressVisible: false });
        });
    });
  }

  ReloadMessages = () => {
    AsyncStorage.getItem("adminId", (err, result) => {
      this.currentUserId = result;
      this.setState({ progressVisible: true });
      let userData = {
        ReceiverId: result
      };

      let followersArray = [];

      axios({
        method: "POST",
        url: "http://www.elgameya.net/api/gamieya/GetMyMessages",
        data: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(resp => {
          console.log(resp);

          let users = resp.data.userMessages;
          for (let x = 0; x < users.length; x++) {
            followersArray.push(
              <ListItem
                icon
                key={x}
                onPress={() => {
                  this.openModalMsg(users[x].id, users[x].full_name);
                }}
              >
                <Left>
                  <Icon name="md-contact" style={{ color: "black" }} />
                </Left>
                <Body>
                  <Text>{users[x].full_name}</Text>
                </Body>
                <Right>
                  <Badge success style={{ backgroundColor: "#262261" }}>
                    <Text style={{ color: "white" }}>open Chat</Text>
                  </Badge>
                </Right>
              </ListItem>
            );
          }
          if (users.length === 0) {
            followersArray.push(
              <View key={0}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={require("../imgs/chat.png")}
                  style={{
                    height: window.height * 70 / 100,
                    width: window.width * 85 / 100,
                    resizeMode: "contain"
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    marginTop:-30,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Button
                    small
                    rounded
                    style={{
                      backgroundColor: "#ACAAD0"
                    }}
                    onPress={() => {}}
                  >
                    <Text style={{ color: "#262261" }}>Start Chat</Text>
                  </Button>
                </View>
              </View>
            );
          }

          this.setState({
            userMessages: followersArray,
            progressVisible: false
          });
        })
        .catch(err => {
          alert("Unexpected error");
          this.setState({ progressVisible: false });
        });
    });
  };

  openModalMsg = (userId, username) => {
    AsyncStorage.getItem("adminId", (err, result) => {
      this.currentUserId = result;
      this.setState({ progressVisible: true, ChatWith: username });
      let userData = {
        ReceiverId: userId,
        SenderId: result
      };

      let ReceiverId = "";

      let ChatArray = [];

      axios({
        method: "POST",
        url: "http://www.elgameya.net/api/gamieya/GetMessagesBetweenTwoPersons",
        data: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(resp => {
          console.log(resp);

          let messages = resp.data.messages;

          for (let x = 0; x < messages.length; x++) {
            if (messages[x].sendeR_ID.toString() === this.currentUserId) {
              ChatArray.push(
                <Row key={x}>
                  <Col />
                  <Col>
                    <Card>
                      <CardItem>
                        <Body>
                          <Text>me:{messages[x].msg}</Text>
                        </Body>
                      </CardItem>
                    </Card>
                  </Col>
                </Row>
              );
            } else {
              ChatArray.push(
                <Row key={x}>
                  <Col>
                    <Card>
                      <CardItem>
                        <Body>
                          <Text>{messages[x].msg}</Text>
                        </Body>
                      </CardItem>
                    </Card>
                  </Col>
                  <Col />
                </Row>
              );
            }
          }

          this.setState(
            { chatBox: ChatArray, progressVisible: false, ReceiverId: userId },
            () => {
              this.refs.ModalMsg.open();

              this.doInterval = setInterval(() => {
                this.reloadChatBox();
              }, 3000);
            }
          );
        })
        .catch(err => {
          alert("Unexpected error");
          this.setState({ progressVisible: false });
        });
    });
  };

  sendMessage() {
    AsyncStorage.getItem("adminId", (err, result) => {
      this.currentUserId = result;
      let userData = {
        RECEIVER_ID: this.state.ReceiverId,
        SENDER_ID: result,
        MSG: this.state.message
      };

      if (this.state.message != "") {
        axios({
          method: "POST",
          url: "http://www.elgameya.net/api/gamieya/SendMessage",
          data: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(resp => {
            console.log(resp);

            let status = resp.data.status;
            this.reloadChatBox();

            this.setState({ message: "" });
          })
          .catch(err => {
            alert("Unexpected error");
          });
      } else {
        alert("enter message");
      }
    });
  }

  reloadChatBox = () => {
    AsyncStorage.getItem("adminId", (err, result) => {
      this.currentUserId = result;
      let userData = {
        ReceiverId: result,
        SenderId: this.state.ReceiverId
      };

      let ReceiverId = "";

      let ChatArray = [];

      axios({
        method: "POST",
        url: "http://www.elgameya.net/api/gamieya/GetMessagesBetweenTwoPersons",
        data: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(resp => {
          console.log(resp);

          let messages = resp.data.messages;
          for (let x = 0; x < messages.length; x++) {
            if (messages[x].sendeR_ID.toString() === this.currentUserId) {
              ChatArray.push(
                <Row key={x}>
                  <Col />
                  <Col>
                    <Card>
                      <CardItem>
                        <Body>
                          <Text>me:{messages[x].msg}</Text>
                        </Body>
                      </CardItem>
                    </Card>
                  </Col>
                </Row>
              );
            } else {
              ReceiverId = messages[x].receiveR_ID;
              ChatArray.push(
                <Row key={x}>
                  <Col>
                    <Card>
                      <CardItem>
                        <Body>
                          <Text>{messages[x].msg}</Text>
                        </Body>
                      </CardItem>
                    </Card>
                  </Col>
                  <Col />
                </Row>
              );
            }
          }

          this.setState({ chatBox: ChatArray }, () => {});
        })
        .catch(err => {
          alert("Unexpected error");
        });
    });
  };

  onModalClose = () => {
    clearInterval(this.doInterval);
  };

  render() {
    const { params } = this.props.navigation.state;

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
              <Icon
                name="menu"
                style={{ color: "white" }}
                onPress={() => {
                  this.props.navigation.navigate("DrawerOpen"); // open drawer
                }}
              />
            </Left>
            <Body>
              <Title>My Messages</Title>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() => {
                  this.ReloadMessages();
                }}
              >
                <Icon name="refresh" style={{ color: "white" }} />
              </Button>
            </Right>
          </Header>

          <List>{this.state.userMessages}</List>
        </Content>

        <Modal
          backButtonClose={true}
          style={[styles.modal, styles.ModalMsg]}
          position={"center"}
          ref={"ModalMsg"}
          swipeToClose={false}
          onClosed={() => {
            this.onModalClose();
          }}
          isDisabled={this.state.isDisabled}
        >
          <Container>
            <Header style={{ backgroundColor: "#262261" }}>
              <Body>
                <Title>{this.state.ChatWith}</Title>
              </Body>
            </Header>
            <ScrollView
              ref="scrollView"
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.refs.scrollView.scrollTo({
                  x: contentWidth,
                  y: contentHeight,
                  animated: true
                });
              }}
            >
              <Grid>{this.state.chatBox}</Grid>
            </ScrollView>
            <View style={{ height: 70 }}>
              <Input
                style={{
                  fontSize: 14,
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 10
                }}
                value={this.state.message}
                onChangeText={text => {
                  this.setState({ message: text });
                }}
                placeholder="message"
              />

              <Button
                style={{ backgroundColor: "#262261", borderRadius: 10 }}
                small
                onPress={() => {
                  this.sendMessage();
                }}
              >
                <Text style={{ color: "white" }}>send message</Text>
              </Button>
            </View>
          </Container>
        </Modal>
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

  modal3: {
    height: "85%",
    width: "85%"
  },
  modalProfile: {
    height: "35%",
    width: "85%"
  },

  textBorder: {
    borderColor: "black",
    borderWidth: 1
  },
  ModalMsg: {
    height: "90%",
    width: "85%"
  },
  viewBorder: {
    borderRadius: 1.5,
    borderWidth: 0.5,
    borderColor: "black"
  }
});
