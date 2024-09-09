import React from 'react';
import { Provider } from 'react-redux';
import { render, act } from '@testing-library/react';  // Import act from react
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../App';

jest.mock('../component/CryptoChart', () => () => <div>Mocked CryptoChart</div>);  // Mocking the chart component

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('App component snapshot', () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      GET_CRYPTO: { loading: false, coins: [], error: null },
      GET_MONTH_WISE: { loading: false, data: [], error: null },
    };
    store = mockStore(initialState);
  });

  test('renders correctly and matches snapshot', async () => {
    let asFragment;

    await act(async () => {
      // Wrap the render call in act
      const result = render(
        <Provider store={store}>
          <App />
        </Provider>
      );
      asFragment = result.asFragment;
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
