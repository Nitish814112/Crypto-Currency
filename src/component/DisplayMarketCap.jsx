import React from 'react';
import currencySymbols from './utility/currencySymbols'; // Import currency symbols
import '../App.css'; // Ensure this line is added to import the CSS

// Define the conversion rates for different currencies relative to USD
const conversionRates = {
  usd: 1,
  inr: 74.38,
  euro: 0.92,
  yen: 153.74,
  aed: 3.67,
  ruble: 85.97,
  yuan: 7.25, // Example rate: 1 USD = 74.38 INR
  // Add more conversion rates here as needed
};

// The DisplayMarketCap component receives a list of coins and the selected currency
const DisplayMarketCap = ({ coins, selectedCurrency }) => {
  
  // Function to convert the market cap to the selected currency
  const convertMarketCap = (marketCap, selectedCurrency) => {
    const rate = conversionRates[selectedCurrency] || 1; // Fallback to USD if no rate found
    return marketCap * rate;
  };

  return (
    <div className="market-cap-container" style={{height:"670px"}}>
      {/* Display the title */}
      <h3 style={{color:'black'}} className="market-cap-title portfolio-text">
        Cryptocurrency by <p>market cap</p>
      </h3>
      <ul className="market-cap-list">
        {/* Map over each coin to display its information */}
        {coins.map((coin) => (
          <li key={coin.id} className="market-cap-item">
            {/* Display the coin image */}
            <img src={coin.image} alt={coin.name} className="market-cap-image" />
            
            <div className="market-cap-details">
              {/* Coin name */}
              <span className="market-cap-name">{coin.name}</span>
              
              {/* Converted market cap value with the selected currency symbol */}
              <span className="market-cap-value">
                {currencySymbols[selectedCurrency]}{convertMarketCap(coin.market_cap, selectedCurrency).toLocaleString()}
              </span>
            </div>

            {/* Market cap change percentage */}
            <span
              className="market-cap-change"
              style={{ color: coin.market_cap_change_percentage_24h >= 0 ? 'green' : 'red' }}
            >
              {/* Display change percentage with a symbol (▲ or ▼) */}
              {coin.market_cap_change_percentage_24h !== null && coin.market_cap_change_percentage_24h !== undefined 
                ? `${coin.market_cap_change_percentage_24h >= 0 ? '▲' : '▼'}${coin.market_cap_change_percentage_24h.toFixed(2)}%`
                : 'N/A'} {/* If no data available, display 'N/A' */}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayMarketCap;
