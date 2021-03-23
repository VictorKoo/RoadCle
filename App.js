/**
 * An App for road bike assistant
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {createAppContainer} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from './views/HomeScreen';

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
});

AppNavigator.navigationOptions = ({navigation}) => {
  return {};
};

export default createAppContainer(AppNavigator);
