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
  Image,
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
import {uploadPoint, calcDistantBySpeed, calcData} from '../services/trackUtil';

class TrackLook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
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
        </SafeAreaView>
      </>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(TrackLook);
