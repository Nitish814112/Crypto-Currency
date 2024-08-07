import axios from 'axios';
import {
  GET_MONTH_REQUEST,
  GET_MONTH_SUCCESS,
  GET_MONTH_FAILURE,
} from '../constant/monthWiseConstant';

const apiKey = 'CG-7oPz64yKkP1A7tpRhxTPTkYc';
//const ids = 'bitcoin';//,ethereum,tether,ripple,binancecoin

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

export const monthWiseActions = (ids) => async (dispatch) => {
  console.log(ids);
  try {
    dispatch({ type: GET_MONTH_REQUEST });

    const currentYear = new Date().getFullYear();
    const cryptoData = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const fetchAllData = async (id) => {
      const monthlyData = {};
      const requests = months.map((_, month) => fetchMonthlyData(id, currentYear, month));
      const results = await Promise.all(requests);

      results.forEach((data, month) => {
        const currentPrice = data.market_data ? data.market_data.current_price.inr : 0;
        monthlyData[months[month]] = currentPrice;
      });

      return monthlyData;
    };

    const allRequests = ids.map(async (id) => {
      const monthlyData = await fetchAllData(id);
      cryptoData[id] = monthlyData;
    });

    await Promise.all(allRequests);

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
