/**
 * Global styles
 */
import {StyleSheet, Platform, StatusBar, Dimensions} from 'react-native';
import data from './config.json';
const {height, width} = Dimensions.get('screen');
const GS = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  global: {
    backgroundColor: data.grayL,
    color: data.orangeL,
  },
  /**Screen's height */
  sHeight: height,
  /**Screen's width */
  sWidth: width,
});

export default GS;
