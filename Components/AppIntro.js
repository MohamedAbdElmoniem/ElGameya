/**
 * Created by abdelmon on 9/25/2017.
 */


import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text, AsyncStorage,
    View, Image, Linking
} from 'react-native';

class AppIntro extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {


       

        setTimeout(() => {

            AsyncStorage.getItem('adminId', (err, result) => {
                if (result != "" && result != undefined && result != null) {
                    this.props.navigation.navigate("HomePage", { id: result });

                }
                else {
                    this.props.navigation.navigate('LoginPage'); // open drawer
                }
            })

        }, 2000);
    }

    render() {

        const { navigate } = this.props.navigation;


        return (
            <View style={styles.content}>

                <Image style={{ height: "45%", width: "70%", resizeMode: "stretch" }}
                    source={require('../imgs/splash.png')}
                />
            </View>
        )
    }


}


const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default AppIntro;