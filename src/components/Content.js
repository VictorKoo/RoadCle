import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
export default class extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <Text style={styles.sign}>下滑停止记录</Text>
        <View style={styles.bottomPanelCol}>
          <Text style={styles.contentText}>{this.props.data.speed}</Text>
          <Text style={styles.unitText}>速度 kmph</Text>
          <Text style={styles.contentText}>{this.props.data.speed}</Text>
          <Text style={styles.unitText}>里程 km</Text>
        </View>
        <View style={styles.bottomPanelCol}>
          <Text style={styles.contentText2}>{this.props.data.speed}</Text>
          <Text style={styles.unitText2}>平均速度 kmph</Text>
        </View>
        <View style={styles.bottomPanelCol}>
          <Text style={styles.contentText2}>{this.props.data.speed}</Text>
          <Text style={styles.unitText2}>时间</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  sign: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  bottomPanelCol: {
    flex: 1,
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
    marginLeft: 50,
  },
  unitText2: {
    flex: 0.5,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    fontSize: 10,
  },
});
