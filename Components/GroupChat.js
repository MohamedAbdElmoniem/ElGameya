import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  BackHandler,
  View,
  Animated,
  Easing,
  Platform,
  TouchableOpacity,
  Switch,
  AsyncStorage,
  Dimensions,
  Image,
  ScrollView
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
  Thumbnail,
  Row,
  Right,
  Form,
  Item,
  Input,
  Icon,
  Tab,
  Tabs,
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
import RNCalendarEvents from "react-native-calendar-events";
import { ProgressDialog } from "react-native-simple-dialogs";
var moment = require("moment");
import Share, { ShareSheet } from "react-native-share";
import PopupDialog, {
  DialogTitle,
  SlideAnimation
} from "react-native-popup-dialog";
var { width } = Dimensions.get("window");
var { height } = Dimensions.get("window");
import TabView from "mkp-react-native-tab-view";
const window = Dimensions.get("window");
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu";
var moment = require("moment");
import SortableList from "react-native-sortable-list";
import * as _ from "lodash";

export default class GroupChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderedMsgs: [],
      msg: ""
    };
  }

  componentWillMount() {
    this.renderGroupMessages();
  }

  renderGroupMessages = () => {
    let cycleData = {
      id: this.props.navigation.state.params.cycle.id
    };
    axios({
      method: "POST",
      url: "http://www.elgameya.net/api/gamieya/GetCycleGroupMessages",
      data: JSON.stringify(cycleData),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => {
        debugger;

        let data = resp.data;
        let renderedData = [];
        if (data.status === "success") {
          if (data.chatMessages.length > 0) {
            for (let x = 0; x < data.chatMessages.length; x++) {
              let foundedUser = _.find(data.members, o => {
                return o.id === data.chatMessages[x].sender_id;
              });
              debugger;
              if (foundedUser.id == this.props.navigation.state.params.userid) {
                renderedData.push(
                  <Row key={x} style={{ marginBottom: 10 }}>
                    <Col style={{ width: "20%" }} />
                    <Col
                      style={{
                        width: "75%",
                        borderWidth: 0.3,
                        backgroundColor: "#E6E6E6",
                        borderRadius: 10
                      }}
                    >
                      <ListItem avatar>
                        <Body>
                          <Text style={{ fontWeight: "bold" }}>
                            {foundedUser.email}
                          </Text>
                          <Text>{data.chatMessages[x].msg}</Text>
                        </Body>
                        <Right>
                          <Thumbnail
                            source={{
                              uri:
                                "https://www.flexygames.net/images/user/user-171302.png"
                            }}
                          />
                        </Right>
                      </ListItem>
                    </Col>
                    <Col style={{ width: "5%" }} />
                  </Row>
                );
              } else {
                renderedData.push(
                  <Row key={x} style={{ marginBottom: 10 }}>
                    <Col style={{ width: "5%" }} />
                    <Col
                      style={{
                        width: "75%",
                        borderWidth: 0.3,
                        backgroundColor: "#E6E6E6",
                        borderRadius: 10
                      }}
                    >
                      <ListItem avatar>
                        <Left>
                          <Thumbnail
                            source={{
                              uri:
                                "https://www.flexygames.net/images/user/user-171302.png"
                            }}
                          />
                        </Left>
                        <Body>
                          <Text style={{ fontWeight: "bold" }}>
                            {foundedUser.email}
                          </Text>
                          <Text>{data.chatMessages[x].msg}</Text>
                        </Body>
                      </ListItem>
                    </Col>
                    <Col style={{ width: "20%" }} />
                  </Row>
                );
              }
            }

            this.setState({ renderedMsgs: renderedData });
          }
        } else {
          // no messages
          let renderedData = [];
          renderedData.push(<Text>There's no messages</Text>);
          this.setState({ renderedMsgs: renderedData });
        }
      })
      .catch(err => {
        this.setState({ progressVisible: false }, () => {
          alert("Unexpected error");
        });
      });
  };

  sendMessage = () => {
    if (this.state.msg === "") {
      alert("please enter a message");
    } else {
      let data = {
        userid: this.props.navigation.state.params.userid,
        cycleid: this.props.navigation.state.params.cycle.id,
        msg: this.state.msg
      };
      axios({
        method: "POST",
        url: "http://www.elgameya.net/api/gamieya/SendGroupMessage",
        data: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(resp => {
          let data = resp.data;
          this.renderGroupMessages();
        })
        .catch(err => {
          this.setState({ progressVisible: false }, () => {
            alert("Unexpected error");
          });
        });
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Header ref="myheader" style={{ backgroundColor: "#9E1F64" }}>
            <Left>
              <Button
                transparent
                onPress={() => {
                  if(this.props.navigation.state.params.page==="NormalCycleView")
                  {
                    navigate("NormalCycleView", {
                      cycleid: this.props.navigation.state.params.cycle,
                      userid: this.props.navigation.state.params.userid
                    });
                  }
                  else{
                    navigate("CycleMembers", {
                      cycleid: this.props.navigation.state.params.cycle,
                      userid: this.props.navigation.state.params.userid
                    });
                  }
               
                }}
              >
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>
                {this.props.navigation.state.params.cycle.cyclE_NAME} group chat
              </Title>
            </Body>
          </Header>
          <ScrollView
            style={{ marginBottom: 45 }}
            ref="scrollView"
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.refs.scrollView.scrollTo({
                x: contentWidth,
                y: contentHeight,
                animated: true
              });
            }}
          >
            <Grid style={{ marginTop: 5 }}>{this.state.renderedMsgs}</Grid>
          </ScrollView>
          <Grid style={{ position: "absolute", bottom: 0 }}>
            <Row style={{ backgroundColor: "#262261" }}>
              <Col style={{ width: "5%" }} />
              <Col style={{ width: "65%" }}>
                <Input
                  onChangeText={text => {
                    this.setState({ msg: text });
                  }}
                  placeholder="Type your message ..."
                  placeholderTextColor="white"
                  style={{ backgroundColor: "#262261", color: "white" }}
                />
              </Col>
              <Col style={{ width: "5%" }} />
              <Col style={{ width: "25%" }}>
                <Button
                  small
                  rounded
                  style={{
                    marginTop: 10,
                    marginRight: 2,
                    backgroundColor: "#ACAAD0"
                  }}
                  onPress={() => {
                    this.sendMessage();
                  }}
                >
                  <Text style={{ color: "#262261" }}>Send</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </View>
      </Container>
    );
  }
}
