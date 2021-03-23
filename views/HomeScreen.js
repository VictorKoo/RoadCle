/**
 *
 */

import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Animated,
  Touchable,
  TouchableWithoutFeedback,
  Pressable,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  onPress,
  // Button,
} from 'react-native';

import {
  BaiduMapManager,
  MapView,
  MapTypes,
  Geolocation,
  Overlay,
  MapApp,
} from 'react-native-baidu-map';

import {SwipeablePanel} from 'rn-swipeable-panel';

import GlobalStyles from '../common/GlobalStyles';

import Config from '../common/config.json';

// Only for iOS
BaiduMapManager.initSDK('G3QhPwGwHOOp6WYZhTtvIDDNxFfoCsVA');

class HomeScreen extends React.Component {
  /** React Navigation 配置 */
  static navigationOptions = {
    tabBarVisible: false,
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      isBottomPanelActive: false,
      content: () => {},
      noBackgroundOpacity: true,
    };
  }
  /**Log something */
  _log(str) {
    if (str != null) {
      console.log(str);
    } else {
      console.log('Something wrong');
      throw new Error('Trying to log a Null Pointer');
    }
  }
  /**PPP */
  _handlePress() {
    console.log('Pressed');
  }
  _handlePressStart() {
    this.setState({
      isBottomPanelActive: this.state.isBottomPanelActive ? false : true,
    });
    this._log(this.state.isBottomPanelActive);
  }
  render() {
    this._log('Rending');
    return (
      <>
        <StatusBar
          barStyle="default"
          translucent={true}
          backgroundColor={Config.primaryBGColor + '88'}
        />
        <SafeAreaView style={[GlobalStyles.global, styles.container]}>
          <MapView
            style={styles.mapView}
            width={GlobalStyles.sWidth}
            height={GlobalStyles.sHeight - 15}
            zoom={18}
            zoomControlsVisible={true}
            mapType={MapTypes.NORMAL}
            zoomGesturesEnabled={true}
            scrollGesturesEnabled={true}
            center={Config.center}
          />
          <SwipeablePanel
            style={styles.panelBottom}
            isActive={this.state.isBottomPanelActive}
            noBackgroundOpacity={this.state.noBackgroundOpacity}
            onClose={() => this.setState({isBottomPanelActive: false})}>
            {this.state.content()}
          </SwipeablePanel>
          {/* <PanelBottom isActive={this.state.isBottomPanelActive} /> */}
          <TouchableOpacity
            onPress={this._handlePress}
            style={[styles.buttonInfo]}>
            <Text>Me</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStart}
            onPress={this._handlePressStart.bind(this)}>
            <Text
              style={{
                fontSize: 30,
              }}>
              Start
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </>
    );
  }
  componentDidMount() {
    this._log('Started');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  mapView: {
    alignItems: 'center',
  },
  /**?? */
  buttonInfo: {
    top: GlobalStyles.sHeight * 0.08,
    left: GlobalStyles.sWidth * 0.08,
    position: 'absolute',
    width: GlobalStyles.sWidth * 0.15,
    height: GlobalStyles.sHeight * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GlobalStyles.global.color,
    borderRadius: 20,
  },
  buttonStart: {
    bottom: 100,
    position: 'absolute',
    width: GlobalStyles.sWidth * 0.5,
    height: GlobalStyles.sHeight * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GlobalStyles.global.color + 'dd',
    borderRadius: 50,
  },
  panelBottom: {
    height: GlobalStyles.sHeight * 0.8,
  },
});

export default HomeScreen;
