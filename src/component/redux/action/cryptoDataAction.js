import axios from 'axios';
import {
  GET_CRYPTODATA_REQUEST,
  GET_CRYPTODATA_SUCCESS,
  GET_CRYPTODATA_FAILURE,
} from '../constant/cryptoDataConstant';

const apiKey = 'CG-7oPz64yKkP1A7tpRhxTPTkYc';
const ids = "bitcoin,ethereum,tether,binancecoin,terra-luna,solana,xrp,toncoin,usdc,dai,steller,stacks,maker,mantle,hedera,cronos,bonk,tron,avalanche,polkadot,uniswap,litecoin,pepe,polygon,kaspa,aptos,monero,filecoin,render,injective,okb,dogwifhat,vechain,arweave,bittensor,floki,jupiter,ondo,notcoin,fantom,core,sei,flow,gate";
const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&x_cg_demo_api_key=${apiKey}`;

export const cryptoDataAction = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CRYPTODATA_REQUEST });
    const { data } = await axios.get(url);
    dispatch({ type: GET_CRYPTODATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_CRYPTODATA_FAILURE,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};