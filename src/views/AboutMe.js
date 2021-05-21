import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native';
import GS from '../common/GlobalStyles';
import Config from '../common/config.json';
import {connect} from 'react-redux';
import {updateUser} from '../../redux/actions/userAction';
import {updateToken} from '../../redux/actions/authAction';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      mathod: this.props.mathod,
      userInfo: {
        id: 0,
        uuid: '',
        online: 0,
        avatar: '',
        name: 'Not login',
        nickname: '',
        sex: 0,
        birthdate: '1999-04-30',
        remark: '',
        telephone: '',
        platform: 'Android',
        createdAt: '',
        updatedAt: '',
      },
    };
  }
  _handlePress() {
    switch (this.props.mathod) {
      case LOGIN:
        this.props.navigation.push('Login');
        break;
      case LOGOUT:
        Alert.alert('登出', '确认登出？\n', [
          {
            text: '是',
            onPress: () => {
              this.props.updateUser(this.state.userInfo);
              this.props.updateToken('');
              this.props.navigation.push('Login');
            },
          },
          {text: '否', onPress: () => {}},
        ]);
        break;
      default:
    }
  }
  render() {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={this._handlePress.bind(this)}>
        <Text style={styles.title}>{this.state.title}</Text>
      </TouchableOpacity>
    );
  }
}

class AboutMe extends Component {
  /** React Navigation 配置 */
  static navigationOptions = {
    tabBarVisible: false,
    headerShown: false,
  };
  constructor(props) {
    super(props);
    if (this.props.user.online === 1) {
      this.state = {
        DATA: [
          {
            title: '用户',
            data: [
              {
                title:
                  this.props.user.name !== ''
                    ? this.props.user.name
                    : 'Not Login.',
                mathod: LOGOUT,
              },
            ],
          },
          {
            title: '记录',
            data: [
              // {
              //   title: '查看',
              //   mathod: 'CHECK',
              // },
            ],
          },
        ],
        recordList: [],
      };
    } else {
      this.state = {
        DATA: [
          {
            title: '用户',
            data: [
              {
                title: '未登录',
                mathod: LOGIN,
              },
            ],
          },
        ],
      };
    }
  }
  _getRecordList() {
    fetch('http://xuedong.online:8088/r/' + this.props.user.uuid, {
      method: 'GET',
    }).then((res) =>
      res.json().then((json) => {
        ToastAndroid.show('查询成功', ToastAndroid.SHORT);
        this.setState({recordList: json});
        this._convertList();
      }),
    );
  }
  _convertList() {
    let data = [];
    for (let i = 0; i < this.state.recordList.length; i++) {
      // console.log(this.state.recordList[i].id);
      let date = new Date(this.state.recordList[i].start_time * 1000);
      data[i] = {
        title:
          '' +
          date.getFullYear() +
          '-' +
          date.getMonth() +
          '-' +
          date.getDate() +
          ' ' +
          date.getHours() +
          ':' +
          date.getMinutes(),
        mathod: 'CHECK',
        rid: this.state.recordList[i].record_id,
      };
    }
    this.setState({
      DATA: [
        {
          title: '用户',
          data: [
            {
              title:
                this.props.user.name !== ''
                  ? this.props.user.name
                  : 'Not Login.',
              mathod: LOGOUT,
            },
          ],
        },
        {
          title: '记录',
          data: data,
        },
      ],
    });
  }
  render() {
    return (
      <>
        <StatusBar />
        <View style={styles.container}>
          <View style={styles.leftCol}>
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
          <View style={styles.rightCol}>
            <View style={styles.list}>
              <SectionList
                sections={this.state.DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => (
                  <Item
                    {...this.props}
                    title={item.title}
                    mathod={item.mathod}
                    rid={item.rid}
                    navigation={this.props.navigation}
                  />
                )}
                renderSectionHeader={({section: {title}}) => (
                  <Text style={styles.header}>{title}</Text>
                )}
              />
            </View>
          </View>
        </View>
      </>
    );
  }
  componentDidMount() {
    this._getRecordList();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    // marginHorizontal: 20,
    flexDirection: 'row',
    // alignContent: 'flex-end',
    // justifyContent: 'flex-end',
  },
  item: {
    backgroundColor: Config.grayL,
    height: 75,
    width: GS.sWidth * 0.7,
    justifyContent: 'center',
    marginVertical: 5,
    marginHorizontal: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#aaaaa0',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  header: {
    fontSize: 32,
    width: GS.sWidth * 0.7,
    // backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    color: Config.yellowD,
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
  buttonBackImg: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    // paddingLeft: 100,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-end',
  },
  leftCol: {
    flex: 3,
    // backgroundColor: 'orange',
  },
  rightCol: {
    flex: 7,
    backgroundColor: Config.orangeL + '05',
    paddingTop: 20,
  },
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  token: state.authReducer.token,
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (user) => dispatch(updateUser(user)),
  updateToken: (token) => dispatch(updateToken(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutMe);
