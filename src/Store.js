import { combineReducers, createStore, applyMiddleware } from "redux";

import { composeWithDevTools } from "redux-devtools-extension";
import {cryptoDataReducer} from './component/redux/reducer/cryptoDataReducer'
import monthWiseReducer from './component/redux/reducer/monthWiseReducer'
import thunk from "redux-thunk/es";

const rootReducer = combineReducers({
  GET_CRYPTO:cryptoDataReducer,
  GET_MONTH_WISE:monthWiseReducer
});
const initialState = {};

const middleware = [thunk];

const Store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default Store;
