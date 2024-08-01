import axios from 'axios';
import {
  GET_MONTH_REQUEST,
  GET_MONTH_SUCCESS,
  GET_MONTH_FAILURE,
} from '../constant/monthWiseConstant';

const apiKey = 'CG-7oPz64yKkP1A7tpRhxTPTkYc';
const ids = 'bitcoin,ethereum,tether,ripple,binancecoin';

const formatDate = (year, month) => {
  const date = new Date(year, month, 1);
  const day = date.getDate();
  const formattedMonth = (month + 1).toString().padStart(2, '0'); // Ensure month is two digits
  const formattedDay = day.toString().padStart(2, '0'); // Ensure day is two digits
  return `${formattedDay}-${formattedMonth}-${year}`;
};

const fetchMonthlyData = async (cryptoId, year, month) => {
  const date = formatDate(year, month);
  const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/history?date=${date}&x_cg_demo_api_key=${apiKey}`;
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    throw new Error(error.response && error.response.data.message
      ? error.response.data.message
      : error.message);
  }
};

export const monthWiseActions = () => async (dispatch) => {
  try {
    dispatch({ type: GET_MONTH_REQUEST });

    const currentYear = new Date().getFullYear();
    const cryptoData = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (const id of ids.split(',')) {
      const monthlyData = {};
      for (let month = 0; month < 12; month++) {
        try {
          const data = await fetchMonthlyData(id, currentYear, month);
          const currentPrice = data.market_data ? data.market_data.current_price.usd : 0;
          monthlyData[months[month]] = currentPrice;
        } catch (error) {
          console.error(`Error fetching data for ${id} for ${months[month]}:`, error.message);
          throw error; // Ensure to throw the error so that it can be caught in the outer try-catch block
        }
      }
      cryptoData[id] = monthlyData;
    }

    dispatch({ type: GET_MONTH_SUCCESS, payload: cryptoData });
  } catch (error) {
    console.error('Error in monthWiseActions:', error.message);
    dispatch({
      type: GET_MONTH_FAILURE,
      payload: error.message, // Ensure error message is dispatched
    });
  }
};

export default monthWiseActions
