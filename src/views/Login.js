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
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {connect} from 'react-redux';
import GS from '../common/GlobalStyles';
import objToQueryString from '../common/ObjToQueryString';
import Config from '../common/config.json';
import {updateUser} from '../../redux/actions/userAction';
import {updateToken} from '../../redux/actions/authAction';

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
      user: {
        uuid: '',
        name: '',
        password: '',
      },
    };
    // updateUser(initialState);
  }
  /**Save user name to reducer */
  _saveUser = () => {
    console.log('Saving user');
    this.props.updateUser(this.state.user);
  };
  /**Fecth user infomation */
  _fetchUserUUIDByName = () => {
    fetch('http://xuedong.online:8088/u/n/' + this.state.user.name, {
      method: 'GET',
    })
      .then((res) => res.text())
      .then((res) => {
        console.log('uuid by name');
        console.log(res);
        this.state.user.uuid = res;
        this.props.updateUser(this.state.user);
      })
      .catch((error) => {
        // console.log(error);
      });
  };
  /**Fetch token and save */
  _fetchToken = () => {
    const queryString = objToQueryString({
      /**UUID持久保存 */
      uuid: this.props.user.uuid,
      /**密码内存存放 */
      psw: this.state.user.password,
    });
    console.log(queryString);
    fetch('http://xuedong.online:8088/auth/pswlogin?' + queryString, {
      method: 'GET',
    })
      // .then((res) => res.text())
      .then((token) => {
        if (token.status !== 200) {
          this._handleLoginFail(token.message);
          this.props.updateToken('');
        } else {
          console.log('fetch token');
          console.log(token);
          this.props.updateToken(token);
          this._handleLoginSuccess();
        }
      })
      .catch((error) => {
        console.log(error);
        this._handleLoginFail('');
      });
  };
  _handleLoginFail = (msg) => {
    Alert.alert('登录失败', '请重新输入\r' + msg, [
      {text: '好', onPress: () => {}},
    ]);
  };
  _handleLoginSuccess = () => {
    ToastAndroid.show('登录成功', ToastAndroid.SHORT);
    this.props.navigation.navigate('Home');
  };
  _handlePressLogin = () => {
    this._fetchUserUUIDByName();
    this._fetchToken();
  };
  render() {
    return (
      <>
        <StatusBar backgroundColor={GS.global.backgroundColor + '88'} />
        <View style={[styles.container]}>
          <View style={styles.leftCol}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={[styles.buttonBack]}>
              <Text>Back</Text>
            </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.rightCol}>
              <Text style={[styles.tips, {color: this.state.tipsColor}]}>
                {this.state.user.name + this.state.user.password}
                {/* {this.state.tips} */}
              </Text>
              {/*  */}
              <Text>
                {this.props.user.uuid}
                {/* {this.props.auth.token} */}
              </Text>
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
              <TextInput
                // placeholder=""
                mode="outlined"
                style={styles.pswInput}
                label="密码"
                // value={this.state.user.password}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.state.user.password = text;
                }}
              />
              <TouchableOpacity
                onPress={this._handlePressLogin.bind(this)}
                style={[styles.loginButton]}>
                <Text>登录</Text>
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
    flexDirection: 'row',
  },
  leftCol: {
    flex: 3,
    // backgroundColor: 'orange',
  },
  rightCol: {
    flex: 7,
    backgroundColor: Config.orangeL + '11',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  buttonBack: {
    top: GS.sHeight * 0.08,
    left: GS.sWidth * 0.08,
    // position: 'absolute',
    width: GS.sWidth * 0.15,
    height: GS.sHeight * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GS.global.color,
    borderRadius: 20,
  },
  nameInput: {
    height: 60,
    justifyContent: 'center',
    margin: 10,
  },
  pswInput: {
    height: 60,
    justifyContent: 'center',
    margin: 10,
  },
  tips: {
    textAlign: 'center',
    height: 100,
    fontSize: 30,
    // color: this.state.tipsColor,
  },
  loginButton: {
    top: GS.sHeight * 0.63,
    right: GS.sWidth * 0.05,
    position: 'absolute',
    width: GS.sWidth * 0.3,
    height: GS.sHeight * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GS.global.color,
    borderRadius: 20,
  },
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  auth: state.authReducer.auth,
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (user) => dispatch(updateUser(user)),
  updateToken: (token) => dispatch(updateToken(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
