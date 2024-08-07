import axios from 'axios';
import {
  GET_MONTH_REQUEST,
  GET_MONTH_SUCCESS,
  GET_MONTH_FAILURE,
} from '../constant/monthWiseConstant';

const apiKey = 'CG-7oPz64yKkP1A7tpRhxTPTkYc';
const ids = "bitcoin,ethereum,tether,binancecoin,terra-luna,solana,xrp,toncoin,usdc,dai,steller,stacks,maker,mantle,hedera,cronos,bonk,tron,avalanche,polkadot,uniswap,litecoin,pepe,polygon,kaspa,aptos,monero,filecoin,render,injective,okb,dogwifhat,vechain,arweave,bittensor,floki,jupiter,ondo,notcoin,fantom,core,sei,flow,gate";

const fetchCurrentMarketData = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&x_cg_demo_api_key=${apiKey}`;
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

    const marketData = await fetchCurrentMarketData();

    const currentYear = new Date().getFullYear();
    const cryptoData = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    marketData.forEach((crypto) => {
      const monthlyData = {};
      months.forEach((month) => {
        // Assuming we somehow get historical data monthly. Here, using current data for simplicity.
        monthlyData[month] = crypto.current_price;
      });
      cryptoData[crypto.id] = monthlyData;
    });
    console.log('cryptoData',cryptoData);
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
