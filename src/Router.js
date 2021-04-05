/**
 * An App for road bike assistant
 * Router
 *
 * @format
 * @flow strict-local
 */

import {createAppContainer} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';

import {HomeScreen, AboutMe, Login} from './views';

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  AboutMe: {
    screen: AboutMe,
  },
  Login: {
    screen: Login,
  },
});

AppNavigator.navigationOptions = ({navigation}) => {
  return {};
};

export default createAppContainer(AppNavigator);
