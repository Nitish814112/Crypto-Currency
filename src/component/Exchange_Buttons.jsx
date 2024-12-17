import React, { useState, useEffect } from 'react';
import '../App.css';

// The Exchange_buttons component allows users to exchange one cryptocurrency for another
const Exchange_buttons = ({ coin }) => {
  // State variables to manage sell and buy currencies, amounts, and exchange rate
  const [sellCurrency, setSellCurrency] = useState('bitcoin'); // Default sell currency is Bitcoin
  const [buyCurrency, setBuyCurrency] = useState('ethereum'); // Default buy currency is Ethereum
  const [sellAmount, setSellAmount] = useState(1); // Default amount to sell is 1
  const [buyAmount, setBuyAmount] = useState(0); // Initially, the buy amount is 0
  const [exchangeRate, setExchangeRate] = useState(0); // The exchange rate between sell and buy currency
  const [tempSellAmount, setTempSellAmount] = useState(''); // Temporary state to hold the input value of sell amount

  // Effect hook to calculate exchange rate and update buyAmount when sellCurrency, buyCurrency, or coins change
  useEffect(() => {
    const sellCoin = coin.find(c => c.id === sellCurrency); // Find selected sell currency
    const buyCoin = coin.find(c => c.id === buyCurrency); // Find selected buy currency

    if (sellCoin && buyCoin) {
      // Calculate exchange rate based on the price of the selected currencies
      const rate = buyCoin.current_price / sellCoin.current_price;
      setExchangeRate(rate);
      setBuyAmount(sellAmount * rate); // Calculate buy amount based on the exchange rate and sell amount
    }
  }, [sellCurrency, buyCurrency, coin, sellAmount]); // Dependencies to trigger the effect

  // Function to handle exchange action, updates the buyAmount based on the exchange rate
  const handleExchange = () => {
    setBuyAmount(sellAmount * exchangeRate); // Recalculate buyAmount when the exchange button is clicked
  };

  // Function to handle changes in the sell amount input
  const handleSellAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) > 0) {
      setTempSellAmount(value); // Set the temporary sell amount
      if (value !== '') {
        setSellAmount(parseFloat(value)); // Update the sell amount if valid input
      }
    }
  };

  // Function to handle when the sell amount input loses focus
  const handleSellBlur = () => {
    if (tempSellAmount === '') {
      setTempSellAmount(sellAmount.toString()); // Reset the temporary value if input is empty
    }
  };

  // Effect hook to update the temporary sell amount when sellAmount changes
  useEffect(() => {
    setTempSellAmount(sellAmount.toString()); // Update temporary value when sellAmount is updated
  }, [sellAmount]);

  return (
    <div>
      <h2 className='portfolio-text absolute' style={{ marginTop: "-20px" }}>Exchange Coins</h2>
      <div className='flex flex-col gap-3 ml-4 mt-8'>
        {/* Sell Currency and Amount */}
        <div className='flex flex-col'>
          <span style={{ marginLeft: '45%' }}>Enter Value</span>
          <div className='flex gap-3 mt-2'>
            <label className='portfolio-text' htmlFor="sellCurrency" style={{ color: 'red' }}>Sell:</label>
            {/* Dropdown to select sell currency */}
            <select className='portfolio-text' style={{ border: "0.5px solid grey", width:"22%"}} id="sellCurrency" value={sellCurrency} onChange={(e) => setSellCurrency(e.target.value)}>
              {coin.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {/* Input to enter the amount of the sell currency */}
            <input className='portfolio-text'
              style={{ border: "0.5px solid grey", color: "red", width:"40%" }}
              type="number"
              value={tempSellAmount}
              onChange={handleSellAmountChange}
              onBlur={handleSellBlur}
              min="0.01"
            />
          </div>
        </div>

        {/* Buy Currency and Amount */}
        <div className='flex gap-3 mt-4'>
          <label className='portfolio-text' style={{ color: 'green' }} htmlFor="buyCurrency">Buy:</label>
          {/* Dropdown to select buy currency */}
          <select className='portfolio-text' style={{ border: "0.5px solid grey", width:"22%" }} id="buyCurrency" value={buyCurrency} onChange={(e) => setBuyCurrency(e.target.value)}>
            {coin.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {/* Input to display the calculated amount of the buy currency */}
          <input className='portfolio-text'
            style={{ border: "0.5px solid grey", color: "green", width:"40%" }}
            type="number"
            value={buyAmount}
            readOnly
          />
        </div>

        {/* Exchange Button */}
        <button className='exchange-button' style={{ marginLeft: "30%", width: '140px', }} onClick={handleExchange}>Exchange</button>
      </div>
    </div>
  );
};

export default Exchange_buttons;
