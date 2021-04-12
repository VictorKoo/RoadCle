/**
 * An App for road bike assistant
 * Redux
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
// import {createStore} from 'redux';
import Router from './Router';
import configureStore from '../redux/store/store';
// const store = createStore(rootReducer);
const {pStore, persistor} = configureStore();
export default class extends React.Component {
  render() {
    return (
      <>
        <Provider store={pStore}>
          <PersistGate persistor={persistor} loading={null}>
            <Router />
          </PersistGate>
        </Provider>
      </>
    );
  }
}
