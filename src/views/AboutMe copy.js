import {ArrowRight} from '@material-ui/icons';
import React from 'react';
import {
  SafeAreaView,
  View,
  VirtualizedList,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import GS from '../common/GlobalStyles';
import config from '../common/config.json';
const DATA = [];
const getItem = (data, index) => {
  return {
    id: Math.random().toString(12).substring(0),
    title: `Item ${index + 1}`,
  };
};
const getItemCount = (data) => {
  return 50;
};
const Item = ({title, id}) => {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        console.log(title);
        console.log(id);
        // console.log(state.userData.name);
      }}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};
class AboutMe extends React.Component {
  /** React Navigation 配置 */
  static navigationOptions = {
    tabBarVisible: false,
    headerShown: false,
  };
  render() {
    return (
      <>
        <StatusBar
          barStyle="default"
          translucent={true}
          backgroundColor={GS.global.backgroundColor + '88'}
        />
        <SafeAreaView style={[GS.droidSafeArea, styles.container]}>
          <View>
            <VirtualizedList
              data={DATA}
              initialNumToRender={4}
              renderItem={({item}) => <Item title={item.title} id={item.id} />}
              keyExtractor={(item) => item.key}
              getItemCount={getItemCount}
              getItem={getItem}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={[styles.buttonBack]}>
            <Text>Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    // paddingTop: 40,
  },
  item: {
    backgroundColor: config.grayL,
    height: 75,
    width: GS.sWidth * 0.7,
    justifyContent: 'center',
    marginVertical: 0,
    marginHorizontal: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#aaaaa0',
  },
  title: {
    fontSize: 20,
    color: config.yellowD,
  },
  buttonBack: {
    top: GS.sHeight * 0.04,
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

export default AboutMe;
