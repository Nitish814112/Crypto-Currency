import React, { useState, useEffect } from 'react';
import '../App.css';

const Exchange_buttons = ({ coin }) => {
  const [sellCurrency, setSellCurrency] = useState('bitcoin');
  const [buyCurrency, setBuyCurrency] = useState('ethereum');
  const [sellAmount, setSellAmount] = useState(1);
  const [buyAmount, setBuyAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [tempSellAmount, setTempSellAmount] = useState(''); // Temporary state for sell input

  useEffect(() => {
    const sellCoin = coin.find(c => c.id === sellCurrency);
    const buyCoin = coin.find(c => c.id === buyCurrency);

    if (sellCoin && buyCoin) {
      const rate = buyCoin.current_price / sellCoin.current_price;
      setExchangeRate(rate);
      setBuyAmount(sellAmount * rate);
    }
  }, [sellCurrency, buyCurrency, coin]);

  const handleExchange = () => {
    setBuyAmount(sellAmount * exchangeRate);
  };

  const handleSellAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) > 0) {
      setTempSellAmount(value);
      if (value !== '') {
        setSellAmount(parseFloat(value));
      }
    }
  };

  const handleSellBlur = () => {
    if (tempSellAmount === '') {
      setTempSellAmount(sellAmount.toString());
    }
  };

  useEffect(() => {
    setTempSellAmount(sellAmount.toString());
  }, [sellAmount]);

  return (
    <div>
      <h2 className='portfolio-text absolute' style={{ marginTop: "-20px" }}>Exchange Coins</h2>
      <div className='flex flex-col gap-3 ml-4 mt-8'>
        <div className='flex flex-col'>
          <span style={{ marginLeft: '45%' }}>Enter Value</span>
          <div className='flex gap-3 mt-2'>
            <label className='portfolio-text' htmlFor="sellCurrency" style={{ color: 'red' }}>Sell:</label>
            <select className='portfolio-text' style={{ border: "0.5px solid grey", width:"22%"}} id="sellCurrency" value={sellCurrency} onChange={(e) => setSellCurrency(e.target.value)}>
              {coin.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input className='portfolio-text'
              style={{ border: "0.5px solid grey", color: "red",width:"40%" }}
              type="number"
              value={tempSellAmount}
              onChange={handleSellAmountChange}
              onBlur={handleSellBlur}
              min="0.01"
            />
          </div>
        </div>

        <div className='flex gap-3 mt-4'>
          <label className='portfolio-text' style={{ color: 'green' }} htmlFor="buyCurrency">Buy:</label>
          <select className='portfolio-text' style={{ border: "0.5px solid grey",width:"22%" }} id="buyCurrency" value={buyCurrency} onChange={(e) => setBuyCurrency(e.target.value)}>
            {coin.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input className='portfolio-text'
            style={{ border: "0.5px solid grey", color: "green",width:"40%" }}
            type="number"
            value={buyAmount}
            readOnly
          />
        </div>

        <button className='exchange-button' style={{ marginLeft: "30%", width: '140px', }} onClick={handleExchange}>Exchange</button>
      </div>
    </div>
  );
};

export default Exchange_buttons;
