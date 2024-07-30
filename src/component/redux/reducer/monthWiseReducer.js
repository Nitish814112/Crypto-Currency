import {
  GET_MONTH_REQUEST,
  GET_MONTH_SUCCESS,
  GET_MONTH_FAILURE,
} from '../constant/monthWiseConstant';

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const monthWiseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MONTH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null, // Reset error on new request
      };
    case GET_MONTH_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case GET_MONTH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default monthWiseReducer