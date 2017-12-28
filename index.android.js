
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,Platform ,
    View
} from 'react-native';
import { Button } from 'native-base';
import axios from 'axios';
import { StackNavigator } from 'react-navigation';
import RegisterationComponent from './Components/RegisterationComponent';
import LoginComponent from './Components/LoginComponent';
import MyCycles from './Components/MyCycles';
import CycleMembers from './Components/CycleMembers';
import Following from './Components/Following';
import Followers from './Components/Followers';
import AllCycles from './Components/AllCycles';
import MyProfile from './Components/MyProfile';
import DrawerExample from './Components/Drawer';
import AppIntro from './Components/AppIntro';
import Tabbed from './Components/Tabbed';
import { BackAndroid } from 'react-native'

export default class elgameya extends Component {


    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }


    render() {

        const { navigate } = this.props.navigation;


        return (
            <View style={styles.container}>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

const SimpleApp = StackNavigator({
    AppIntro: { screen: AppIntro },
    RegisterationPage: { screen: RegisterationComponent },
    LoginPage: { screen: LoginComponent },
    HomePage: { screen: DrawerExample },
    MyCycles: { screen: MyCycles,path:"chat/:user"  },
    CycleMembers: { screen: CycleMembers },
    Following: {  screen: Following },
    Followers: {  screen: Followers },
    AllCycles: { screen: AllCycles },
    MyProfile: {  screen: MyProfile}

}, {
        headerMode: 'none',
    });

    const prefix = Platform.OS == 'android' ? 'mychat://mychat/' : 'mychat://';

const MainApp = () => <SimpleApp uriPrefix={prefix} />;


AppRegistry.registerComponent('elgameya', () => MainApp);
