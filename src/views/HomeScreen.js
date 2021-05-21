/**
 * @file 骑行地图
 * @author Victor Koo
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
  PermissionsAndroid,
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
import {
  uploadPoint,
  calcDistantBySpeed,
  calcData,
  endRecord,
} from '../services/trackUtil';

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
      /**定位监听器ID */
      locatorId: '',
      /**定时器ID */
      intervalId: 0,
      /**地图中心点 */
      center: {
        latitude: 22.366718,
        longitude: 113.554467,
      },
      /**位置 */
      location: {
        /**速度 */
        speed: 0,
        /**经度 */
        longitude: 0,
        /**纬度 */
        latitude: 0,
        /**精度 */
        accuracy: 0,
        /**指向 */
        heading: 0,
        /**海拔高度 */
        altitude: 0,
        /**海拔精度 */
        altitudeAccuracy: 0,
        /**时间戳 */
        timestamp: 0,
      },
      /**记录的开始时间 */
      startTime: 0,
      /**记录的结束时间 */
      endTime: 0,
      /**记录UUID */
      recordId: '',
      /**地图标记 */
      markers: [],
      /**轨迹 */
      tracks: [],
      // isBottomPanelActive: false,
      /**面板信息 */
      contentData: {
        /**速度 */
        speed: 0,
        /**里程 */
        mileage: 0,
        /**时间 */
        duration: '00:03',
        /**爬升 */
        climb: 0,
        /**平均速度 */
        averageSpeed: 0,
      },
      /**地图放大级别 */
      zoom: 20,
    };
  }
  /**Press "Me" button */
  _handlePressMe() {
    console.log('Pressed Me');
    this.props.navigation.push('AboutMe');
  }
  /**Press Start button */
  _handlePressStart() {
    this.props.startTrack();
    console.log(this.props.isTracking);
    this.state.contentData = calcData(
      1000,
      this.state.location.speed,
      this.state.contentData.mileage,
      this.state.location.altitude,
      Date.parse(new Date()),
      true,
    );
    this._startTrack();
  }
  /**Locate once */
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
            center: {
              latitude: success.coords.latitude,
              longitude: success.coords.longitude,
            },
            location: {...success.coords, timestamp: success.timestamp},
          });
        }
      },
      (err) => console.log(err),
    );
  };
  /**
   * 在线创建记录，获取记录ID并保存在组件state
   * @param {Number=} start_time 开始时间 (s)
   * @return {String} record ID
   */
  _createRecord = (start_time = this.state.startTime) => {
    fetch('http://xuedong.online:8088/r/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: this.props.token ? this.props.token : '',
      },
      body: JSON.stringify({
        user_uuid: this.props.user.user_uuid
          ? this.props.user.user_uuid
          : '6c3ee671-a8db-41c0-9806-693a4c5c9257',
        start_time: start_time,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          Alert.alert('创建记录失败', '请检查网络\n' + res.status, [
            {text: '确认', onPress: () => {}},
          ]);
        } else {
          res.json().then((json) => {
            return json.record_id;
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  /**本地持久保存轨迹并计算数据 */
  _startTrack = () => {
    console.log('Tracking');
    if (this.state.location.accuracy > 50) {
      Alert.alert('注意', '当前卫星信号弱，请前往开阔地带', [
        {
          text: '确认',
          onPress: () => {
            this._stopTracking.bind(this);
          },
        },
      ]);
    }
    // 创建记录
    this.state.recordId = this._createRecord(
      this.state.location.timestamp / 1000,
    );
    this.state.intervalId = setInterval(async () => {
      console.log('Interval calc data: ' + this.state.intervalId);
      let contentData = await calcData(
        1000,
        this.state.location.speed,
        this.state.contentData.mileage,
        this.state.location.altitude,
        Date.parse(new Date()),
        false,
      );
      this.setState({contentData: contentData});
    }, 1000);
  };
  /**停止记录 */
  _stopTracking = () => {
    console.log('Stopping tracking');
    clearInterval(this.state.intervalId);
    this.props.endTrack();
    endRecord(
      this.state.recordId,
      this.state.location.timestamp / 1000,
      this.props.token ? this.props.token : '',
    );
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
              <Overlay.Circle
                radius={this.state.location.accuracy}
                fillColor="22ffd60a"
                stroke={{width: 2, color: 'aaffd60a'}}
                center={this.state.location}
              />
            </MapView>
          </View>
          <BottomPanel
            data={this.state.contentData}
            isActive={this.props.isTracking}
            onClose={() => {
              this.props.endTrack();
              this._stopTracking();
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
  /**
   * 加载完毕后开始监听位置
   */
  async componentDidMount() {
    console.log('Started');
    this._locateOnce();
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '权限请求',
          message: '应用需要获取定位权限',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('');
      } else {
        Alert.alert('注意', '应用需要定位权限', [
          {
            text: '确认',
            onPress: () => {
              this._stopTracking();
            },
          },
        ]);
      }
    } catch (err) {
      console.warn(err);
    }
    /**Begin watching position */
    this.state.locatorId = navigator.geolocation.watchPosition(
      (location) => {
        /**百度坐标系 */
        let bdCoord = gcoord.transform(
          [location.coords.longitude, location.coords.latitude], // 经度, 纬度
          gcoord.WGS84, // 当前坐标系
          gcoord.BD09, // 目标坐标系
        );
        location.coords.longitude = bdCoord[0];
        location.coords.latitude = bdCoord[1];
        this.setState({
          location: {...location.coords, timestamp: location.timestamp},
        });
        /**若开始记录轨迹 */
        if (this.props.isTracking) {
          this.setState({
            tracks: [...this.state.tracks, this.state.location],
          });
          uploadPoint(
            this.props.user.user_uuid ? this.props.user.user_uuid : 'test08',
            Number(this.state.location.timestamp) / 1000,
            this.state.location.longitude,
            this.state.location.latitude,
            this.state.location.speed,
            this.state.location.heading,
            this.state.location.altitude,
            this.state.location.accuracy,
          );
        }
        // console.log('time: ' + this.state.location.timestamp);
        // console.log('acc: ' + this.state.location.accuracy);
        // console.log('speed: ' + this.state.location.speed);
      },
      (error) => {
        Alert.alert('获取位置失败：' + error);
      },
      /**Navigator configuration */
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 0,
      },
    );
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.state.locatorId);
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
