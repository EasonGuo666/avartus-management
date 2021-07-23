import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../saga';
import rootReducer from '../slices';
import { persistStore, persistReducer } from "redux-persist"
import storage from 'redux-persist/es/storage'

const config = {
  key: 'root',
  storage,
}

const sagaMiddleware = createSagaMiddleware()

export const reducer = persistReducer(config, rootReducer);

export const store = createStore(reducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));

export const persistor = persistStore(store)

sagaMiddleware.run(rootSaga);
