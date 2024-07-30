// utils/currencyConverter.js
const conversionRates = {
    usd: 1,
    inr: 74.5,
    euro: 0.85,
    // Add more conversion rates as needed
  };
  
  export const convertCurrency = (coins, selectedCurrency) => {
    const rate = conversionRates[selectedCurrency] || 1;
    return coins.map(coin => ({
      ...coin,
      market_cap: coin.market_cap * rate,
      current_price: coin.current_price * rate,
    }));
  };
  