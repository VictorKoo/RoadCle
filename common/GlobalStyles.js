/**
 * Global styles
 */
import {StyleSheet, Platform, StatusBar, Dimensions} from 'react-native';
import data from './config.json';
const {height, width} = Dimensions.get('screen');
export default StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  global: {
    backgroundColor: data.primaryBGColor,
    color: data.primaryFGColor,
  },
  /**Screen's height */
  sHeight: height,
  /**Screen's width */
  sWidth: width,
});
