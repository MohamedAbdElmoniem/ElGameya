/**
 * Created by abdelmon on 8/2/2017.
 */
import React from 'react';
import {
    AppRegistry,
    Text,
    View, Image, AsyncStorage, TouchableHighlight, Dimensions
} from 'react-native';
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
    StyleProvider, Button
} from 'native-base';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import HomeComponent from './HomeComponent'
import RegisterationComponent from './RegisterationComponent'
import Followers from './Followers'
import Following from './Following'
import Tabbed from './Tabbed'
import { LoginManager } from 'react-native-fbsdk'
var { width } = Dimensions.get('window');

const MyNavScreen = ({ navigation, banner }) => (
    <ScrollView style={styles.container}>
        <Button
            onPress={() => navigation.navigate('DrawerOpen')}
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
    </ScrollView>
);

const InboxScreen = ({ navigation }) => (
    <MyNavScreen navigation={navigation} />
);
InboxScreen.navigationOptions = {
    drawerLabel: 'Inbox',
    drawerIcon: ({ tintColor }) => (
        <Icon active name="logo-googleplus" />

    ),
};


const DraftsScreen = ({ navigation }) => (
    <MyNavScreen navigation={navigation} />
);
DraftsScreen.navigationOptions = {
    drawerLabel: 'Drafts',
    drawerIcon: ({ tintColor }) => (
        <Icon active name="logo-googleplus" />
    ),
};


const DrawerExample = DrawerNavigator(
    {
        Profile: {
            path: '/profile',
            screen: Tabbed,
        },
        Followers: {
            path: '/Followers',
            screen: Followers,
        },
        Following: {
            path: '/Following',
            screen: Following,
        }

    },
    {
        initialRouteName: 'Profile',
        drawerWidth: (width * 65) / 100,
        contentComponent: props => <ScrollView>
            <Grid style={{marginRight:120 }}>
                <Row>
                    <Col></Col>
                    <Col><Image style={{height: width/4, width: (width*40)/100, resizeMode: "center"}}
                        source={require('../imgs/gamieya.png')} />
                    </Col>
                    <Col></Col>
                </Row>
            </Grid>
            <DrawerItems {...props} />
            <TouchableHighlight onPress={() => {
                AsyncStorage.setItem('adminId', "", () => {
                    LoginManager.logOut()
                    props.navigation.navigate("LoginPage");

                });
            }}>
                <Grid style={styles.buttonLogin}>
                    <Row>
                        <Col></Col>
                        <Col><Text style={styles.textColor}>Logout</Text>
                        </Col>
                        <Col></Col>
                    </Row>
                </Grid>
            </TouchableHighlight>
        </ScrollView>,
        contentOptions: {
            activeTintColor: '#e91e63',

        }
    }
);

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 20 : 0,
    },
    buttonLogin: {
        backgroundColor: "#262261",
        height: 50,
    },
    textColor: {
        color: "white",
        textAlign: 'center',
        marginTop: 12,
        fontSize: 15
    }
});

export default DrawerExample;