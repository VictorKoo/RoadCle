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
      userInfo: {},
    };
    // updateUser(initialState);
  }
  /**Save user name to reducer */
  _saveUser = () => {
    console.log('Saving user');
    fetch('http://xuedong.online:8088/u/' + this.props.user.uuid, {
      method: 'GET',
      headers: {
        Authorization: this.props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          ToastAndroid.show('系获取用户信息出错', ToastAndroid.SHORT);
          console.log('user info fail ' + res.status);
        } else {
          res.json(() => {
            console.log('user info ' + res[0].uuid);
            this.state.userInfo = res[0];
            this.state.userInfo.online = 1;
            this.props.updateUser(this.state.userInfo);
            // console.log('user: ' + res[0]);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.props.updateUser(this.state.user);
  };
  /**Fecth user infomation */
  _fetchUserUUIDByName = () => {
    fetch('http://xuedong.online:8088/u/n/' + this.state.user.name, {
      method: 'GET',
    })
      .then((res) => res.text())
      .then((res) => {
        console.log('get uuid by name ' + res);
        this.state.user.uuid = res;
        this.state.user.online = 1;
        this.props.updateUser(this.state.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  /**Fetch token and save */
  _fetchToken = () => {
    const queryString =
      'uuid=' + this.props.user.uuid + '&psw=' + md5(this.state.user.password);
    console.log(queryString);
    fetch('http://xuedong.online:8088/auth/pswlogin?' + queryString, {
      method: 'GET',
    })
      .then((res) => {
        if (res.status !== 200) {
          console.log('fetch token fail ' + res.status);
          this._handleLoginFail(res.message);
          this.props.updateToken('');
        } else {
          res.text().then((t) => {
            console.log('fetch token');
            console.log('Token: ' + t);
            this.props.updateToken(t);
            this._handleLoginSuccess();
          });
        }
      })
      .catch((error) => {
        console.warn(error);
        this._handleLoginFail(error);
      });
  };
  _handleLoginFail = (msg = '') => {
    Alert.alert('登录失败', '请重新输入\n' + msg, [
      {text: '好', onPress: () => {}},
    ]);
  };
  _handleLoginSuccess = () => {
    ToastAndroid.show('登录成功', ToastAndroid.SHORT);
    // Alert.alert('登录', '用户信息\n' + this.props.user.name, [
    //   {text: '好', onPress: () => {}},
    // ]);
    this._saveUser();
    this.props.navigation.navigate('Home');
  };
  _handlePressLogin = () => {
    ToastAndroid.show('稍侯', ToastAndroid.SHORT);
    this._fetchUserUUIDByName();
    this._fetchToken();
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
              <Text style={styles.h1}>登录</Text>
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
                onBlur={() => {
                  this._fetchUserUUIDByName.bind(this);
                }}
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
                onPress={this._handlePressLogin.bind(this)}
                style={[styles.loginButton]}>
                <Text>登录</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push('Logup');
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
  h1: {
    fontSize: 45,
    // top: GS.sHeight * 0.0,
    textAlign: 'center',
    // height: ,
    lineHeight: 50,
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
  loginButton: {
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
  logupButton: {
    top: GS.sHeight * 0.7,
    right: GS.sWidth * 0.38,
    position: 'absolute',
    width: GS.sWidth * 0.3,
    height: GS.sHeight * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GS.global.color + '22',
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
