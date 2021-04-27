/**
 *
 */

import React from 'react';
import geolocation from '@react-native-community/geolocation';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Alert,
  TouchableOpacity,
  AppState,
} from 'react-native';
import {connect} from 'react-redux';
import {
  BaiduMapManager,
  MapView,
  MapTypes,
  Overlay,
} from 'react-native-baidu-map';
import gcoord from 'gcoord';
import GS from '../common/GlobalStyles';
import BottomPanel from '../components/BottomPanel';
import Config from '../common/config.json';
import {endTrack, startTrack, addPoint} from '../../redux/actions/trackAction';

// Only for iOS
BaiduMapManager.initSDK('G3QhPwGwHOOp6WYZhTtvIDDNxFfoCsVA');

navigator.geolocation = geolocation;

class HomeScreen extends React.Component {
  /** React Navigation 配置 */
  static navigationOptions = {
    tabBarVisible: false,
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      locatorId: '',
      center: {},
      location: {},
      markers: [],
      tracks: [
        // {
        //   latitude: 22.366718,
        //   longitude: 113.554467,
        //   altitude: 0.0,
        // },
        // {
        //   latitude: 22.367035,
        //   longitude: 113.553726,
        //   altitude: 0.0,
        // },
      ],
      // isBottomPanelActive: false,
      /**面板信息 */
      contentData: {
        speed: 0,
      },
      noBackgroundOpacity: true,
      zoom: 20,
    };
  }
  /**Press Me button */
  _handlePressMe() {
    console.log('Pressed Me');
    this.props.navigation.push('AboutMe');
  }
  /**Press Start button */
  _handlePressStart() {
    this.props.startTrack();
    console.log(this.props.isTracking);
    this._startTracking();
  }
  /**Locate now */
  _locateOnce = () => {
    console.log('Locate');
    navigator.geolocation.getCurrentPosition(
      (success) => {
        /**百度坐标系 */
        let bdCoord = gcoord.transform(
          [success.coords.longitude, success.coords.latitude], // 经度, 纬度
          gcoord.WGS84, // 当前坐标系
          gcoord.BD09, // 目标坐标系
        );
        success.coords.longitude = bdCoord[0];
        success.coords.latitude = bdCoord[1];
        if (
          success.coords.latitude === Number.MIN_VALUE &&
          success.coords.longitude === Number.MIN_VALUE
        ) {
          Alert.alert('定位出错', '请重试\n', [
            {text: '确认', onPress: () => {}},
          ]);
        } else {
          console.log('lat: ' + success.coords.latitude);
          console.log('lot: ' + success.coords.longitude);
          this.setState({
            center: success.coords,
            location: success.coords,
          });
        }
      },
      (err) => console.log(err),
    );
  };
  _startTracking = () => {
    console.log('tracking');
    this.state.locatorId = navigator.geolocation.watchPosition(
      (success) => {
        /**百度坐标系 */
        let bdCoord = gcoord.transform(
          [success.coords.longitude, success.coords.latitude], // 经度, 纬度
          gcoord.WGS84, // 当前坐标系
          gcoord.BD09, // 目标坐标系
        );
        success.coords.longitude = bdCoord[0];
        success.coords.latitude = bdCoord[1];
        if (
          success.coords.latitude === Number.MIN_VALUE &&
          success.coords.longitude === Number.MIN_VALUE
        ) {
          Alert.alert('定位出错', '请重试\n', [
            {text: '确认', onPress: () => {}},
          ]);
        } else {
          console.log('lat: ' + success.coords.latitude);
          console.log('lot: ' + success.coords.longitude);
          this.setState({
            tracks: [
              ...this.state.tracks,
              {
                latitude: success.coords.latitude,
                longitude: success.coords.longitude,
              },
            ],
            center: success.coords,
            location: success.coords,
          });
        }
      },
      (err) => console.log(err),
    );
  };
  _stopTracking = () => {
    console.log('Stopping tracking');
    navigator.geolocation.clearWatch(this.state.locatorId);
  };
  render() {
    console.log('Rending Home');
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
              zoom={this.state.zoom}
              zoomControlsVisible={true}
              mapType={MapTypes.NORMAL}
              zoomGesturesEnabled={true}
              scrollGesturesEnabled={true}
              center={this.state.center}
              markers={this.state.markers}
              locationData={this.state.location}
              showsUserLocation={true}>
              {this.props.isTracking ? (
                <Overlay.Polyline
                  points={
                    this.state.tracks.length > 1
                      ? this.state.tracks
                      : [
                          {
                            latitude: 22.366304,
                            longitude: 113.553335,
                            // altitude: 0.0,
                          },
                          {
                            latitude: 22.366994,
                            longitude: 113.554323,
                            // altitude: 0.0,
                          },
                        ]
                  }
                  stroke={{width: 10, color: Config.yellowD}}
                />
              ) : null}
            </MapView>
          </View>
          <BottomPanel
            data={this.state.contentData}
            isActive={this.props.isTracking}
            onClose={() => {
              this.props.endTrack();
              this._stopTracking.bind(this);
            }}
          />
          <TouchableOpacity
            onPress={this._handlePressMe.bind(this)}
            style={[styles.infoButton]}>
            <Text>我</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this._locateOnce.bind(this)}
            style={[styles.locateButton]}>
            <Text>定位</Text>
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
    console.log('Started');
    this._startTracking.bind(this);
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
  locateButton: {
    top: GS.sHeight * 0.14,
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
