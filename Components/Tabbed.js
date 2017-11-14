/**
 * Created by abdelmon on 9/10/2017.
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
    Image,
    View,
    TouchableOpacity, Switch, AsyncStorage, BackHandler
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
    Tab, Tabs
} from 'native-base';
import axios from 'axios'

import { ProgressDialog } from 'react-native-simple-dialogs';
import { TabNavigator } from 'react-navigation';
import HomeComponent from './HomeComponent'
import Messages from './Messages'
import CyclesHome from './CyclesHome'




const Tabbed = TabNavigator({
    cyclesHome: {
        screen: CyclesHome,
        path: "cyclesHome"
    },
    HomeProfile: {
        screen: HomeComponent,
    },
    Messages: {
        screen: Messages,
    }
}, 
{
        tabBarPosition: 'bottom',
        animationEnabled: true,
        backBehavior: 'none',
        tabBarOptions: {

            activeTintColor: 'white',
            activeBackgroundColor: '#A9BCF5',
            showIcon: true,
            showLabel: false,
            style: {
                backgroundColor: '#262261',
            }
        }
    });

export default Tabbed;