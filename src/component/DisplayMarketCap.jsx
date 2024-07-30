import React from 'react';
import currencySymbols from './utility/currencySymbols';
import '../App.css'; // Ensure this line is added to import the CSS

const conversionRates = {
  usd: 1,
  inr: 74.38,
  euro: 0.92,
  yen: 153.74,
  aed: 3.67,
  ruble: 85.97,
  yuan: 7.25, // Example rate: 1 USD = 74.38 INR
  // Add more conversion rates here
};

const DisplayMarketCap = ({ coins, selectedCurrency }) => {
  const convertMarketCap = (marketCap, selectedCurrency) => {
    const rate = conversionRates[selectedCurrency] || 1;
    return marketCap * rate;
  };

  return (
    <div className="market-cap-container" style={{height:"670px"}}>
      <h3 className="market-cap-title portfolio-text">Cryptocurrency by <p>market cap</p></h3>
      <ul className="market-cap-list">
        {coins.map((coin) => (
          <li key={coin.id} className="market-cap-item">
            <img src={coin.image} alt={coin.name} className="market-cap-image" />
            <div className="market-cap-details">
              <span className="market-cap-name">{coin.name}</span>
              <span className="market-cap-value">
                {currencySymbols[selectedCurrency]}{convertMarketCap(coin.market_cap, selectedCurrency).toLocaleString()}
              </span>
            </div>
            <span
              className="market-cap-change"
              style={{ color: coin.market_cap_change_percentage_24h >= 0 ? 'green' : 'red' }}
            >
              {coin.market_cap_change_percentage_24h !== null && coin.market_cap_change_percentage_24h !== undefined 
                ? `${coin.market_cap_change_percentage_24h >= 0 ? '▲' : '▼'}${coin.market_cap_change_percentage_24h.toFixed(2)}%`
                : 'N/A'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayMarketCap;
