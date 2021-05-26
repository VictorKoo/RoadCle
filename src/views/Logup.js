/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ToastAndroid,
  Image,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {connect} from 'react-redux';
import GS from '../common/GlobalStyles';
import objToQueryString from '../common/ObjToQueryString';
import Config from '../common/config.json';
import {updateUser} from '../../redux/actions/userAction';
import {updateToken} from '../../redux/actions/authAction';
import md5 from 'md5';

class Login extends React.Component {
  static navigationOptions = {
    tabBarVisible: false,
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      tips: '',
      token: '',
      tipsColor: Config.orangeL,
      pswVisible: false,
      user: {
        uuid: '',
        name: '',
        password: '',
      },
    };
    // updateUser(initialState);
  }
  /**
   *
   * @param {String} name
   * @param {String} password
   */
  _logup = (name, password) => {
    fetch('http://xuedong.online:8088/auth/pswsignup', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        password: md5(password),
      }),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((json) => {
            this.setState({user: json});
          });
          Alert.alert('注册成功', '\n' + this.state.user.name, [
            {
              text: '登录',
              onPress: () => {
                this.props.navigation.navigate('Login');
              },
            },
          ]);
          return true;
        } else {
          Alert.alert('注册失败', '请重新输入\n' + res.status, [
            {text: '好', onPress: () => {}},
          ]);
        }
      })
      .catch((e) => {
        console.warn(e);
      });
    return false;
  };
  _handlePressLogup = () => {
    ToastAndroid.show('稍侯', ToastAndroid.SHORT);
    let boo = false;
    boo = this._logup(this.state.user.name, this.state.user.password);
    if (boo) {
      ToastAndroid.show('注册成功', ToastAndroid.SHORT);
    } else {
    }
  };
  render() {
    return (
      <>
        <StatusBar backgroundColor={GS.global.backgroundColor + '88'} />
        <View style={[styles.container]}>
          <View style={styles.leftRow}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={[styles.buttonBack]}>
              <Image
                style={styles.buttonBackImg}
                source={require('../images/back.png')}
              />
            </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.rightRow}>
              <Text style={styles.h1}>注册</Text>
              <Text style={[styles.tips, {color: this.state.tipsColor}]}>
                {/* {this.state.user.name + this.state.user.password} */}
                {this.state.tips}
              </Text>
              {/*  */}
              {/* <Text> */}
              {/* {this.props.user.uuid} */}
              {/* {this.props.token} */}
              {/* </Text> */}
              <TextInput
                mode="outlined"
                style={styles.nameInput}
                label="用户名"
                // value={this.state.user.userName}
                onChangeText={(text) => {
                  this.state.user.name = text;
                }}
                onBlur={() => {}}
              />
              <View style={styles.pswRow}>
                <TextInput
                  // placeholder=""
                  mode="outlined"
                  style={styles.pswInput}
                  label="密码"
                  // value={this.state.user.password}
                  secureTextEntry={!this.state.pswVisible}
                  onChangeText={(text) => {
                    this.state.user.password = text;
                  }}
                />
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.setState({pswVisible: !this.state.pswVisible});
                  }}>
                  {this.state.pswVisible ? (
                    <Image
                      style={styles.eyeImg}
                      source={require('../images/eye.png')}
                    />
                  ) : (
                    <Image
                      style={styles.eyeImg}
                      source={require('../images/eye-closed.png')}
                    />
                  )}
                </TouchableWithoutFeedback>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this._handlePressLogup();
                }}
                style={[styles.logupButton]}>
                <Text>注册</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    flexDirection: 'column',
  },
  leftRow: {
    flex: 1,
    // backgroundColor: 'orange',
  },
  rightRow: {
    flex: 8,
    backgroundColor: Config.orangeL + '11',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  buttonBack: {
    top: GS.sHeight * 0.07,
    left: GS.sWidth * 0.08,
    // position: 'absolute',
    width: GS.sWidth * 0.15,
    height: GS.sHeight * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GS.global.color,
    borderRadius: 20,
  },
  buttonBackImg: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    fontSize: 45,
    // top: GS.sHeight * 0.0,
    textAlign: 'center',
  },
  nameInput: {
    height: 60,
    justifyContent: 'center',
    margin: 10,
  },
  pswInput: {
    width: GS.sWidth * 0.83,
    justifyContent: 'center',
    margin: 10,
  },
  pswRow: {
    height: 60,
    flexDirection: 'row',
  },
  tips: {
    textAlign: 'center',
    height: 100,
    fontSize: 30,
    // color: this.state.tipsColor,
  },
  logupButton: {
    top: GS.sHeight * 0.7,
    right: GS.sWidth * 0.05,
    position: 'absolute',
    width: GS.sWidth * 0.3,
    height: GS.sHeight * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GS.global.color,
    borderRadius: 20,
  },
  eyeImg: {
    width: 21,
    height: 14,
    alignSelf: 'center',
    marginRight: 10,
  },
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  token: state.authReducer.token,
  auth: state.authReducer.auth,
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (user) => dispatch(updateUser(user)),
  updateToken: (token) => dispatch(updateToken(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
