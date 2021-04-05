/**
 *
 */

import React from 'react';
import {Touchable, TouchableOpacity, View} from 'react-native';
import GlobalStyles from '../common/GlobalStyles';
import {Button} from 'react-native-paper';

export default class extends React.Component {
  render() {
    let {style, children} = this.props;
    return (
      <>
        {/* <TouchableOpacity onPress={this.props.onPress}> */}
        <Button
          style={[_style, style]}
          mode="contained"
          // onPress={this.props.onPress}
        >
          {children}
        </Button>
        {/* </TouchableOpacity> */}
      </>
    );
  }
}

let _style = {
  width: GlobalStyles.sWidth * 0.15,
  height: GlobalStyles.sHeight * 0.05,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: GlobalStyles.global.color,
  borderRadius: 20,
  top: GlobalStyles.sHeight * 0.08,
  left: GlobalStyles.sWidth * 0.08,
  position: 'absolute',
};
