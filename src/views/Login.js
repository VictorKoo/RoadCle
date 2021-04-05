import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import GS from '../common/GlobalStyles';
import Config from '../common/config.json';
import {connect} from 'react-redux';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

class Login extends Component {
  /** React Navigation 配置 */
  static navigationOptions = {
    tabBarVisible: false,
    headerShown: false,
  };
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <View></View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack();
          }}
          style={[styles.buttonBack]}>
          <Text>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    // marginHorizontal: 20,
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
  },
  buttonBack: {
    top: GS.sHeight * 0.08,
    left: GS.sWidth * 0.08,
    position: 'absolute',
    width: GS.sWidth * 0.15,
    height: GS.sHeight * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GS.global.color,
    borderRadius: 20,
  },
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = (dispatch) => ({
  // addName: (data) => dispatch(addName(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
