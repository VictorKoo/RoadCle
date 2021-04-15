import {combineReducers} from 'redux';
import userReducer from './userReducer';
import recordReducer from './recordReducer';
import authReducer from './authReducer';
import trackReducer from './trackReducer';
// export const rootReducer = combineReducers({
//   userReducer,
//   authReducer,
// });
export const persistentReducer = combineReducers({
  userReducer,
  recordReducer,
  authReducer,
  trackReducer,
});
