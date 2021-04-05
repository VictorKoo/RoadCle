/**
 *
 */

import React from 'react';
import GlobalStyles from '../common/GlobalStyles';
import {Button} from 'react-native-paper';

export default class extends React.Component {
  render() {
    let {style, children} = this.props;
    return (
      // <>
      <Button
        style={[style, _style]}
        mode="contained"
        uppercase="false"
        // onPress={this.props.onPress}
      >
        {children}
      </Button>
      // </>
    );
  }
}

let _style = {
  width: GlobalStyles.sWidth * 0.5,
  height: GlobalStyles.sHeight * 0.1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: GlobalStyles.global.color + 'dd',
  borderRadius: 50,
  border: 0,
};
