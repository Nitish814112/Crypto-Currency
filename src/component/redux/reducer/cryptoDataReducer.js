// Import action type constants
import {
  GET_CRYPTODATA_REQUEST,
  GET_CRYPTODATA_SUCCESS,
  GET_CRYPTODATA_FAILURE,
} from "../constant/cryptoDataConstant";

// Reducer function to handle crypto data state
export const cryptoDataReducer = (state = { coins: [] }, action) => {
  switch (action.type) {
    // Case to handle the initiation of the data fetch
    case GET_CRYPTODATA_REQUEST:
      return {
        loading: true, // Set loading state to true
        coins: [],     // Reset coins data to an empty array
      };

    // Case to handle successful data fetch
    case GET_CRYPTODATA_SUCCESS:
      return {
        loading: false,     // Set loading state to false
        coins: action.payload, // Populate state with fetched coin data
      };

    // Case to handle failure during the data fetch
    case GET_CRYPTODATA_FAILURE:
      return {
        loading: false,       // Set loading state to false
        error: action.payload, // Set error message in state
      };

    // Default case: return the current state if no matching action type
    default:
      return state;
  }
};
