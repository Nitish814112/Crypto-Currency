import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {cryptoDataReducer} from './component/redux/reducer/cryptoDataReducer'
import monthWiseReducer from './component/redux/reducer/monthWiseReducer'

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
