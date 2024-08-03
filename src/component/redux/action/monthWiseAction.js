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

const fetchMonthlyData = async (cryptoId, year, month, retryCount = 0) => {
  const date = formatDate(year, month);
  const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/history?date=${date}&x_cg_demo_api_key=${apiKey}`;
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retryCount < 5) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchMonthlyData(cryptoId, year, month, retryCount + 1);
    } else {
      throw new Error(error.response && error.response.data.message
        ? error.response.data.message
        : error.message);
    }
  }
};

const fetchAllData = async (id, currentYear, months) => {
  const monthlyData = {};
  
  for (let month = 0; month < months.length; month++) {
    const data = await fetchMonthlyData(id, currentYear, month);
    const currentPrice = data.market_data ? data.market_data.current_price.usd : 0;
    monthlyData[months[month]] = currentPrice;
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay between requests to control rate limit
  }
  
  return monthlyData;
};

const concurrencyLimit = 3; // Number of concurrent requests

export const monthWiseActions = () => async (dispatch) => {
  try {
    dispatch({ type: GET_MONTH_REQUEST });

    const currentYear = new Date().getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const cryptoData = {};
    const cryptoIds = ids.split(',');

    const processBatch = async (batch) => {
      const promises = batch.map(id => fetchAllData(id, currentYear, months));
      const results = await Promise.all(promises);
      results.forEach((data, index) => {
        cryptoData[batch[index]] = data;
      });
    };

    for (let i = 0; i < cryptoIds.length; i += concurrencyLimit) {
      const batch = cryptoIds.slice(i, i + concurrencyLimit);
      await processBatch(batch);
    }

    dispatch({ type: GET_MONTH_SUCCESS, payload: cryptoData });
  } catch (error) {
    console.error('Error in monthWiseActions:', error.message);
    dispatch({
      type: GET_MONTH_FAILURE,
      payload: error.message, 
    });
  }
};

export default monthWiseActions;
