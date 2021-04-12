import {persistentReducer, rootReducer} from '../reducers';
import {applyMiddleware, createStore, compose} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const store = createStore(rootReducer);
// export default store;

const persistConfig = {
  key: 'root', // 对于数据 key 的定义
  storage: AsyncStorage, // 选择的存储引擎
};

// 对 reducers 的封装处理
const persistedReducer = persistReducer(persistConfig, persistentReducer);
// 记录操作
let loggerMiddleware = createLogger();

export default function configureStore() {
  const enhancers = compose(applyMiddleware(thunk, loggerMiddleware));
  // 未持久化的store
  // const store = createStore(rootReducer);
  // 处理后的 reducers 需要作为参数传递在 createStore 中
  const pStore = createStore(persistedReducer, enhancers);
  // 持久化 pStore
  let persistor = persistStore(pStore);
  return {pStore, persistor};
}
