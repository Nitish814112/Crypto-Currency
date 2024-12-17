import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cryptoDataAction } from "./component/redux/action/cryptoDataAction";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "./App.css";
import Coin from "./component/Coin";
import CryptoChart from "./component/CryptoChart";
import Exchange_buttons from "./component/Exchange_Buttons";
import DisplayMarketCap from "./component/DisplayMarketCap";
import currencySymbols from "./component/utility/currencySymbols";
import Nav from "./component/Nav";
import { monthWiseActions } from "./component/redux/action/monthWiseAction";

// Currency options for selection in the dropdown
const currencyOptions = [
  { value: "bitcoin", label: "Bitcoin" },
  { value: "ethereum", label: "Ethereum" },
  { value: "tether", label: "Tether" },
  { value: "ripple", label: "Ripple" },
  { value: "binancecoin", label: "Binance Coin" },
];

function App() {
  const dispatch = useDispatch();
  
  // Accessing global state via useSelector
  const GET_CRYPTO = useSelector((state) => state.GET_CRYPTO);
  const GET_MONTH_WISE = useSelector((state) => state.GET_MONTH_WISE);

  const { loading: loadingCrypto, coins, error: errorCrypto } = GET_CRYPTO;
  const { loading: loadingMonthWise, data, error: errorMonthWise } = GET_MONTH_WISE;

  // Local state management
  const [overallLoading, setOverallLoading] = useState(true);
  const [overallError, setOverallError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [selectedCurrencies, setSelectedCurrencies] = useState([currencyOptions[0]]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch cryptocurrency and monthly data when component mounts or selectedCurrencies changes
  useEffect(() => {
    dispatch(monthWiseActions(selectedCurrencies.map((currency) => currency.value)));
    dispatch(cryptoDataAction());
  }, [dispatch, selectedCurrencies]);

  // Manage loading and error states
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

  // Retry fetching data if an error occurs
  const handleRetry = () => {
    setOverallError(null);
    dispatch(cryptoDataAction());
    dispatch(monthWiseActions(selectedCurrencies.map((currency) => currency.value)));
  };

  // Handle selection or deselection of currencies
  const handleCurrencyChange = (currency) => {
    setSelectedCurrencies((prevSelected) => {
      if (prevSelected.some((selected) => selected.value === currency.value)) {
        return prevSelected.filter(
          (selected) => selected.value !== currency.value
        ); // Remove if already selected
      } else {
        return [...prevSelected, currency]; // Add if not selected
      }
    });
  };

  // Search functionality to find a specific coin
  const handleSearch = (e) => {
    e.preventDefault();
    const result = coins.find(
      (coin) => coin.name.toLowerCase() === searchTerm.toLowerCase()
    );
    setSearchResult(result ? result : "No coins found");
  };

  // List of available fiat currencies for selection
  const variousCountriesCurrency = ["usd", "inr", "euro", "aed", "yuan", "ruble", "yen"];

  // Close modal after clicking outside
  const closeModal = () => {
    setSearchResult(null);
  };

  // Handle clicking outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
   <div className="main-cont">
      {overallLoading ? (
        // Display loading message while data is being fetched
        <h2 className="spin">
          Loading Your Dashboard... <span id="spinner"></span>
        </h2>
      ) : overallError ? (
        // Display error message if there was an issue with fetching data
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
                {/* Currency Selection Dropdown */}
                <select
                  className="portfolio-text changeText"
                  style={{
                    fontSize: "0.8rem",
                    paddingLeft: "15px",
                    borderRadius: "8px",
                  }}
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  {variousCountriesCurrency.map((currency) => (
                    <option
                    className="portfolio-text"
                      style={{ fontSize: "0.8" }}
                      key={currency}
                      value={currency}
                    >
                      {currency[0].toUpperCase() + currency.slice(1)}
                    </option>
                  ))}
                </select>
                {/* Coin Search Form */}
                <form onSubmit={handleSearch}>
                  <input
                    className="shadow_input"
                    style={{ width: "500px", padding: "15px" }}
                    type="search"
                    placeholder="🔍Search by coin"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div>
              <div className="graph">
                <div className="relative inline-block text-left selecting" ref={dropdownRef}>
                  <div
                  style={{height:"40px",PaddingTop:'-50px'}}
                    className="border border-gray-300 bg-white  p-1 cursor-pointer setText widthprob"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    Currency  <span className="font-thin text-gray-300">|</span> <KeyboardArrowDownIcon />
                  </div>
                  {dropdownOpen && (
                    <div className=" absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 flex flex-col">
                      {currencyOptions.map((currency) => (
                        <label
                          key={currency.value}
                          className="flex items-center p-2 "
                        >
                          <input
                            type="checkbox"
                            value={currency.value}
                            checked={selectedCurrencies.some(
                              (selected) => selected.value === currency.value
                            )}
                            onChange={() => handleCurrencyChange(currency)}
                            className="mr-2"
                          />
                          <span>{currency.label}  </span> 
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {/* Render CryptoChart Component */}
                <CryptoChart
                  data={data}
                  selectedCurrencies={selectedCurrencies.map(
                    (currency) => currency.value
                  )}
                />
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
              {/* Render DisplayMarketCap Component */}
              <DisplayMarketCap
                coins={coins}
                selectedCurrency={selectedCurrency}
              />
            </div>
          </div>
          <div className="footer">
            <h1>Made with ❤️ by Nitish ©️ 2024</h1>
          </div>
          {/* Modal for displaying search result */}
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
    </div>
  );
}

export default App;
