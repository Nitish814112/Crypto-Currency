import {
    GET_CRYPTODATA_REQUEST,
    GET_CRYPTODATA_SUCCESS,
    GET_CRYPTODATA_FAILURE,
  } from "../constant/cryptoDataConstant";
  export const cryptoDataReducer = (state = { coins: [] }, action) => {
    switch (action.type) {
      case GET_CRYPTODATA_REQUEST:
        return { loading: true, coins: [] };
        break;
      case GET_CRYPTODATA_SUCCESS:
        return { loading: false, coins: action.payload };
        break;
      case GET_CRYPTODATA_FAILURE:
        return { loading: false, error: action.payload };
        break;
      default:
        return state;
    }
  };
  