import {Height} from '@material-ui/icons';
import React, {Children} from 'react';
import {View} from 'react-native';
import {SwipeablePanel} from 'rn-swipeable-panel';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: () => null,
      isActive: props.isActive,
      openLarge: false,
      onlyLarge: false,
      fullWidth: false,
      noBackgroundOpacity: true,
      bounceAnimation: false,
      closeOnTouchOutside: false,
      noBar: false,
      showCloseButton: false,
      onlySmall: false,
      allowTouchOutside: false,
      barStyle: {},
      panelStyles: {},
    };
  }
  render() {
    let {children, style} = this.props;
    return (
      <View style={[_style, style]}>
        <View>{children}</View>
        <SwipeablePanel
          isActive={this.state.isActive}
          noBackgroundOpacity={this.state.noBackgroundOpacity}
          onClose={() => this.setState({isActive: false})}>
          {this.state.content()}
        </SwipeablePanel>
      </View>
    );
  }
}
let _style = {
  height: 150,
};
