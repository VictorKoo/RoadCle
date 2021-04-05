import {combineReducers} from 'redux';
import userReducer from './userReducer';
import recordReducer from './recordReducer';
export const rootReducer = combineReducers({
  userReducer,
});
export const persistentReducer = combineReducers({
  recordReducer,
});
