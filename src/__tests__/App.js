import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../App';

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

  test('renders correctly and matches snapshot', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
