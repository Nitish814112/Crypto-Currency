import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cryptoDataAction } from "./component/redux/action/cryptoDataAction";
import "./App.css";
import Coin from "./component/Coin";
import CryptoChart from "./component/CryptoChart";
import Exchange_buttons from "./component/Exchange_Buttons";
import DisplayMarketCap from "./component/DisplayMarketCap";
import currencySymbols from "./component/utility/currencySymbols";
import Nav from "./component/Nav";
import { monthWiseActions } from "./component/redux/action/monthWiseAction";

function App() {
  const dispatch = useDispatch();
  const GET_CRYPTO = useSelector((state) => state.GET_CRYPTO);
  const GET_MONTH_WISE = useSelector((state) => state.GET_MONTH_WISE);

  const { loading: loadingCrypto, coins, error: errorCrypto } = GET_CRYPTO;
  const {
    loading: loadingMonthWise,
    data,
    error: errorMonthWise,
  } = GET_MONTH_WISE;
  // console.log('errorMonthWise :',errorMonthWise);

  const [overallLoading, setOverallLoading] = useState(true);
  const [overallError, setOverallError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    dispatch(cryptoDataAction());
    dispatch(monthWiseActions());
  }, [dispatch]);

  useEffect(() => {
    if (!loadingCrypto && !loadingMonthWise) {
      setOverallLoading(false);
      if (errorCrypto || errorMonthWise) {
        setOverallError(true);
      } else {
        setOverallError(false);
      }
    } else {
      setOverallLoading(true);
    }
  }, [loadingCrypto, loadingMonthWise, errorCrypto, errorMonthWise]);

  const handleRetry = () => {
    setOverallError(null);
    dispatch(cryptoDataAction());
    dispatch(monthWiseActions());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const result = coins.find(
      (coin) => coin.name.toLowerCase() === searchTerm.toLowerCase()
    );
    setSearchResult(result ? result : "No coins found");
  };

  const variousCountriesCurrency = ["usd", "inr", "euro", "aed", "yuan", "ruble", "yen"];

  const closeModal = () => {
    setSearchResult(null);
  };

  return (
    <>
      {overallLoading ? (
        <h2 className="spin">
        Loading Your Dashboard... <span id="spinner"></span>
        </h2>
      ) : overallError ? (
        <div className="error-message">
          <h2>Something went wrong</h2>
          <button onClick={handleRetry}>⟳</button>
        </div>
      ) : (
        <>
          
            <div className="nav">
              <Nav />
            </div>
          

          <div className="main">
            <div className="left">
              <div className="search">
                <select
                  className="shadow portfolio-text"
                  style={{fontSize:"0.8rem",paddingLeft:"15px", borderRadius: '8px'}}
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  {variousCountriesCurrency.map((currency) => (
                    <option style={{fontSize:"0.8"}} key={currency} value={currency}>
                      {currency[0].toUpperCase()+currency.slice(1)}
                    </option>
                  ))}
                </select>
                <form onSubmit={handleSearch}>
                  <input
                    className="shadow_input"
                    style={{width:"500px",padding:"15px"}}
                    type="search"
                    placeholder="🔍Search by coin"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div>
              <div className="graph">
                <CryptoChart data={data} />
              </div>
              <div className="exchange_portfolio">
                <div className="portfolio">
                  <Coin coin={coins} />
                </div>
                <div className="exchange">
                  <Exchange_buttons coin={coins} />
                </div>
              </div>
            </div>
            <div className="right">
              <DisplayMarketCap coins={coins} selectedCurrency={selectedCurrency} />
            </div>
            
          </div>
          <div className="footer"><h1>Made with ❤️ by Nitish ©️  2024</h1></div>
          {searchResult && (
            <div
              className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              onClick={closeModal}
            >
              <div
                className="modal-container relative bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                >
                  &times;
                </button>
                <div className="modal">
                  {typeof searchResult === "string" ? (
                    <p>{searchResult}</p>
                  ) : (
                    <div>
                      <img
                        src={searchResult.image}
                        alt={searchResult.name}
                        className="coin-image"
                      />
                      <h3 className="portfolio-text">{searchResult.name}</h3>
                      <p className="portfolio-text">
                      
                        Current Price: {currencySymbols[selectedCurrency]}
                        {searchResult.current_price.toLocaleString()}
                      </p>
                      <p className="portfolio-text">
                        Market Cap: {currencySymbols[selectedCurrency]}
                        {searchResult.market_cap.toLocaleString()}
                      </p>
                      <p
                        className={`price-change ${
                          searchResult.price_change_percentage_24h >= 0
                            ? "green"
                            : "red"
                        } portfolio-text`}
                      >
                        {searchResult.price_change_percentage_24h >= 0
                          ? "▲"
                          : "▼"}
                        {searchResult.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;
