import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import {
  GET_CRYPTODATA_REQUEST,
  GET_CRYPTODATA_SUCCESS,
  GET_CRYPTODATA_FAILURE,
} from '../component/redux/constant/cryptoDataConstant';
import { cryptoDataAction } from '../component/redux/action/cryptoDataAction';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new AxiosMockAdapter(axios);

describe('cryptoDataAction', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  afterEach(() => {
    mock.reset();
  });

  it('should dispatch GET_CRYPTODATA_SUCCESS when fetching data is successful', async () => {
    const mockData = [
      { id: 'bitcoin', name: 'Bitcoin', current_price: 30000 },
      { id: 'ethereum', name: 'Ethereum', current_price: 2000 },
    ];

    mock.onGet(/api.coingecko.com/).reply(200, mockData);

    const expectedActions = [
      { type: GET_CRYPTODATA_REQUEST },
      { type: GET_CRYPTODATA_SUCCESS, payload: mockData },
    ];

    await store.dispatch(cryptoDataAction());
    const actions = store.getActions();

    expect(actions).toEqual(expectedActions);
    expect(actions).toMatchSnapshot(); 
  });

  it('should dispatch GET_CRYPTODATA_FAILURE when fetching data fails', async () => {
    const errorMessage = 'Network Error';
    
    mock.onGet(/api.coingecko.com/).reply(500, { message: errorMessage });

    const expectedActions = [
      { type: GET_CRYPTODATA_REQUEST },
      { type: GET_CRYPTODATA_FAILURE, payload: errorMessage },
    ];

    await store.dispatch(cryptoDataAction());
    const actions = store.getActions();

    expect(actions).toEqual(expectedActions);
    expect(actions).toMatchSnapshot(); 
  });
});
