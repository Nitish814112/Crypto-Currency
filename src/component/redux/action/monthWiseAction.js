import axios from 'axios';
// Import action type constants
import {
  GET_MONTH_REQUEST,
  GET_MONTH_SUCCESS,
  GET_MONTH_FAILURE,
} from '../constant/monthWiseConstant';

// API key for CoinGecko API
const apiKey = 'CG-7oPz64yKkP1A7tpRhxTPTkYc';

// Function to format the date into 'DD-MM-YYYY'
const formatDate = (year, month) => {
  const date = new Date(year, month, 1);
  const day = date.getDate();
  const formattedMonth = (month + 1).toString().padStart(2, '0'); // Ensure month is two digits
  const formattedDay = day.toString().padStart(2, '0'); // Ensure day is two digits
  return `${formattedDay}-${formattedMonth}-${year}`;
};

// Function to fetch historical monthly data for a specific cryptocurrency
const fetchMonthlyData = async (cryptoId, year, month) => {
  const date = formatDate(year, month);
  const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/history?date=${date}&x_cg_demo_api_key=${apiKey}`;
  
  try {
    // Fetch data using axios
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    // Throw a formatted error message
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
};

// Redux action to fetch month-wise historical crypto data
export const monthWiseActions = (ids) => async (dispatch) => {
  console.log('Fetching data for these IDs:', ids);

  try {
    // Dispatch request action to set loading state
    dispatch({ type: GET_MONTH_REQUEST });

    const currentYear = new Date().getFullYear(); // Get the current year
    const cryptoData = {}; // Object to hold all the fetched data

    // Array of month labels for better readability
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to fetch all month-wise data for a single cryptocurrency ID
    const fetchAllData = async (id) => {
      const monthlyData = {}; // Object to hold data for the current cryptocurrency

      // Create an array of promises to fetch data for all months
      const requests = months.map((_, month) => fetchMonthlyData(id, currentYear, month));
      
      // Wait for all the requests to resolve
      const results = await Promise.all(requests);

      // Process the results and map them to month names
      results.forEach((data, month) => {
        // Extract the price (in INR) if available, or set it to 0
        const currentPrice = data.market_data ? data.market_data.current_price.inr : 0;
        monthlyData[months[month]] = currentPrice;
      });

      return monthlyData;
    };

    // Fetch data for all the IDs provided
    const allRequests = ids.map(async (id) => {
      const monthlyData = await fetchAllData(id);
      cryptoData[id] = monthlyData; // Store the monthly data for each ID
    });

    // Wait for all cryptocurrency data requests to complete
    await Promise.all(allRequests);

    // Dispatch success action with the fetched data
    dispatch({ type: GET_MONTH_SUCCESS, payload: cryptoData });
  } catch (error) {
    console.error('Error in monthWiseActions:', error.message);

    // Dispatch failure action with the error message
    dispatch({
      type: GET_MONTH_FAILURE,
      payload: error.message,
    });
  }
};

export default monthWiseActions;
