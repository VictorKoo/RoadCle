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
import {connect} from 'react-redux';
import {
  BaiduMapManager,
  MapView,
  MapTypes,
  Geolocation,
  Overlay,
  MapApp,
  Polyline,
} from 'react-native-baidu-map';
// import {SwipeablePanel} from 'rn-swipeable-panel';
import GS from '../common/GlobalStyles';
import Content from '../components/Content';
import {SwipeablePanel} from '../components/SwipablePanel';
import BottomPanel from '../components/BottomPanel';
import Config from '../common/config.json';
import {endTrack, startTrack, addPoint} from '../../redux/actions/trackAction';

// Only for iOS
BaiduMapManager.initSDK('G3QhPwGwHOOp6WYZhTtvIDDNxFfoCsVA');

class HomeScreen extends React.Component {
  /** React Navigation 配置 */
  static navigationOptions = {
    tabBarVisible: false,
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      center: {},
      location: {},
      markers: [],
      // isBottomPanelActive: false,
      /**面板信息 */
      contentData: {
        speed: 0,
      },
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
  /**Press Me button */
  _handlePressMe() {
    console.log('Pressed');
    this.props.navigation.push('AboutMe');
  }
  /**Press Start button */
  _handlePressStart() {
    this.props.startTrack();
    this._log(this.props.isTracking);
  }
  /**Locate now */
  _locateOnce = () => {
    console.log('Locate');
    Geolocation.getCurrentPosition()
      .then((data) => {
        this.setState({
          // zoom: 18,
          markers: [
            {
              latitude: data.latitude,
              longitude: data.longitude,
              title: '我的位置',
            },
          ],
          center: data,
          location: data,
        });
      })
      .catch((error) => {
        console.warn(error, 'error');
      });
  };
  render() {
    this._log('Rending');
    return (
      <>
        <StatusBar
          barStyle="default"
          translucent={true}
          backgroundColor={GS.global.backgroundColor + '88'}
        />
        <SafeAreaView style={[GS.global, styles.container]}>
          <View style={styles.mapView}>
            <MapView
              width={GS.sWidth}
              height={GS.sHeight}
              zoom={25}
              zoomControlsVisible={true}
              mapType={MapTypes.NORMAL}
              zoomGesturesEnabled={true}
              scrollGesturesEnabled={true}
              center={this.state.center}
              markers={this.state.markers}
              locationData={this.state.location}
              showsUserLocation={true}>
              {/* <Polyline points={this.props.trackPoint} /> */}
            </MapView>
          </View>
          <BottomPanel
            data={this.state.contentData}
            isActive={this.props.isTracking}
            onClose={() => {
              this.props.endTrack();
            }}
          />
          <TouchableOpacity
            onPress={this._handlePressMe.bind(this)}
            style={[styles.infoButton]}>
            <Text>我</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.startButton}
            onPress={this._handlePressStart.bind(this)}>
            <Text style={styles.startButtonText}>开始骑行</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </>
    );
  }
  componentDidMount() {
    this._log('Started');
    this._locateOnce();
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
  /**个人信息按钮 */
  infoButton: {
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
  startButton: {
    bottom: 40,
    position: 'absolute',
    width: GS.sWidth * 0.5,
    height: GS.sHeight * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GS.global.color + 'dd',
    borderRadius: 50,
  },
  startButtonText: {
    fontSize: 30,
    // fontFamily: 'GOST',
  },
  bottomPanel: {
    // height: GS.sHeight * 0.7,
  },
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  isTracking: state.trackReducer.isTracking,
  record_id: state.trackReducer.record_id,
  trackPoint: state.trackReducer.trackPoint,
});

const mapDispatchToProps = (dispatch) => ({
  endTrack: () => dispatch(endTrack()),
  startTrack: () => dispatch(startTrack()),
  addPoint: (p, id) => dispatch(addPoint(p, id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
