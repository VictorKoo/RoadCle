/**
 *
 */

import React from 'react';
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';

import GlobalStyles from '../common/GlobalStyles';

let FULL_HEIGHT = Dimensions.get('window').height;
let FULL_WIDTH = Dimensions.get('window').width;
let PANEL_HEIGHT = FULL_HEIGHT - 100;

const STATUS = {
  CLOSED: 0,
  SMALL: 1,
  LARGE: 2,
};

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**展示阶段 */
      status: 1,
      oPosition: {
        /**初始下沉深度 */
        bottom: -(GlobalStyles.sHeight * 0.8 * 0.8),
      },
      position: {
        bottom: -(GlobalStyles.sHeight * 0.8 * 0.8),
      },
      const: new Animated.ValueXY(),
    };
    /**平面动画 */
    this.pan = new Animated.ValueXY({x: 0, y: FULL_HEIGHT});
    this.animatedValueY = 0;
    /**监听事件 */
    this._handlePanResponderMove = this._handlePanResponderMove.bind(this);
    this._handlePanResponderRelease = this._handlePanResponderRelease.bind(
      this,
    );
    console.log('C');
    /**创建响应器 */
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderRelease,
      onPanResponderGrant: (evt, gestureState) => {
        this.state.pan.setOffset({
          x: 0,
          y: this.animatedValueY,
        });
        this.state.pan.setValue({x: 0, y: 0});
      },
    });
  }
  /**
   * @deprecated — 16.3, use componentDidMount or the constructor instead; will stop working in React 17
   */
  componentWilMount() {}
  /**移动事件响应器 */
  _handlePanResponderMove = (e, gestureState) => {
    console.log('Moving');
    if (
      this.state.status === 1 &&
      -gestureState.dy >= 20 &&
      -gestureState.dy <= 100
    ) {
      console.log(gestureState.dy);
      // 应设置动画
      // Animated.timing(this.state.position.bottom, {
      //   toValue: this.state.oPosition.bottom + 300,
      //   duration: 1000,
      // }).start();
      this.setState({
        stage: this.state.status + 1,
        position: {
          bottom: this.state.position.bottom + 100,
        },
      });
    }
    if (
      this.state.status === 2 &&
      gestureState.dy >= 20 &&
      gestureState.dy <= 100
    ) {
      console.log(gestureState.dy);
      // 设置动画
      // Animated.timing(this.state.position.bottom, {
      //   toValue: this.state.oPosition.bottom - 300,
      //   duration: 1000,
      // }).start();
      this.setState({
        stage: this.state.status - 1,
        position: {
          bottom: this.state.position.bottom - 100,
        },
      });
    }
  };
  _handlePanResponderRelease = (e, gestureState) => {
    console.log('Released');
    this.setState({
      oPosition: this.state.position,
    });
  };
  render() {
    let {style, children} = this.props;
    const handlePress = () => {
      console.log('T');
    };
    const handlePress2 = () => {
      console.log('TT');
    };
    return (
      //   <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[_styles.root, style, {bottom: this.state.position.bottom}]}>
        <View>{children}</View>
        <Text>{this.state.position.bottom}</Text>
      </Animated.View>
      //   </TouchableWithoutFeedback>
    );
  }
  componentDidMount() {
    console.log('DM');
  }
}

let _styles = StyleSheet.create({
  root: {
    width: GlobalStyles.sWidth * 1,
    height: GlobalStyles.sHeight * 0.8,
    backgroundColor: '#fff',
    position: 'absolute',
  },
  //   box: {
  //     backgroundColor: '#61dafb',
  //     width: 80,
  //     height: 80,
  //     borderRadius: 4,
  //   },
});
