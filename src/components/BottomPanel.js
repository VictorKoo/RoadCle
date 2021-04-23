import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {SwipeablePanel} from './SwipablePanel';
import GS from '../common/GlobalStyles';
import {connect} from 'react-redux';
import {endTrack, startTrack} from '../../redux/actions/trackAction';

class BottomPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: () => null,
      isActive: this.props.isTracking,
      openLarge: false,
      onlyLarge: false,
      fullWidth: true,
      noBackgroundOpacity: true,
      bounceAnimation: false,
      closeOnTouchOutside: false,
      noBar: false,
      showCloseButton: false,
      onlySmall: false,
      allowTouchOutside: true,
      barStyle: {},
      panelStyles: {},
      contentData: {
        speed: 0,
      },
    };
  }
  render() {
    // let {children, style} = this.props;
    return (
      <SwipeablePanel
        {...this.props}
        style={_style}
        noBackgroundOpacity={this.state.noBackgroundOpacity}
        allowTouchOutside={this.state.allowTouchOutside}
        // closeOnTouchOutside={true}
        fullWidth={this.state.fullWidth}
        isActive={this.props.isTracking}
        onClose={this.props.onClose}>
        <View style={styles.container}>
          <Text style={styles.sign}>下滑停止记录</Text>
          <View style={styles.bottomPanelCol}>
            <Text style={styles.contentText}>0.0</Text>
            <Text style={styles.unitText}>速度 kmph</Text>
            <Text style={styles.contentText}>0.0</Text>
            <Text style={styles.unitText}>里程 km</Text>
          </View>
          <View style={styles.bottomPanelCol}>
            <Text style={styles.contentText2}>0.0</Text>
            <Text style={styles.unitText2}>平均速度 kmph</Text>
          </View>
          <View style={styles.bottomPanelCol}>
            <Text style={styles.contentText2}>00:01</Text>
            <Text style={styles.unitText2}>时间</Text>
          </View>
        </View>
      </SwipeablePanel>
    );
  }
}
let _style = {
  height: GS.sHeight - 230,
};
const styles = StyleSheet.create({
  container: {
    marginRight: GS.sWidth * 0.1,
    marginLeft: GS.sWidth * 0.1,
  },
  sign: {
    // flex: 1,
    fontSize: 10,
    textAlign: 'center',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  bottomPanelCol: {
    // flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 30,
  },
  contentText: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    textAlign: 'right',
    fontSize: 100,
    fontFamily: 'GOST',
  },
  unitText: {
    flex: 0.2,
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    textAlign: 'left',
    fontSize: 10,
  },
  contentText2: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 100,
    marginLeft: 0,
  },
  unitText2: {
    flex: 0.2,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    fontSize: 10,
  },
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  isTracking: state.trackReducer.isTracking,
  record_id: state.trackReducer.record_id,
});

const mapDispatchToProps = (dispatch) => ({
  endTrack: () => dispatch(endTrack()),
  startTrack: () => dispatch(startTrack()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomPanel);
