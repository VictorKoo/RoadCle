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

class Item extends Component {
  _handlePress() {
    switch (this.props.mathod) {
      case LOGIN:
        this.props.navigation.push('Login');
      default:
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      mathod: this.props.mathod,
    };
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
                title: this.props.user.name,
                mathod: LOGOUT,
              },
            ],
          },
          {
            title: '记录',
            data: [
              {
                title: '查看',
                mathod: 'CHECK',
              },
            ],
          },
        ],
      };
    } else {
      this.state = {
        DATA: [
          {
            title: '用户',
            data: [
              {
                title: this.props.user.name,
                mathod: LOGIN,
              },
            ],
          },
        ],
      };
    }
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
              <Text>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightCol}>
            <View style={styles.list}>
              <SectionList
                sections={this.state.DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => (
                  <Item
                    title={item.title}
                    mathod={item.mathod}
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
    marginVertical: 0,
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
    backgroundColor: Config.orangeL + '11',
    paddingTop: 20,
  },
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

const mapDispatchToProps = (dispatch) => ({
  // addName: (data) => dispatch(addName(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutMe);
