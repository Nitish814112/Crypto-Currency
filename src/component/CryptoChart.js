import React, { useState, useEffect } from "react";
import { Line, Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  RadialLinearScale,
  Title,
  CategoryScale,
  ArcElement,
} from "chart.js";
import Select from "react-select";

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  RadialLinearScale,
  Title,
  CategoryScale,
  ArcElement
);

const currencyOptions = [
  { value: "bitcoin", label: "Bitcoin" },
  { value: "ethereum", label: "Ethereum" },
  { value: "tether", label: "Tether" },
  { value: "ripple", label: "Ripple" },
  { value: "binancecoin", label: "Binance Coin" },
];

const chartTypes = [
  { value: "line", label: "Line" },
  { value: "bar", label: "Bar" },
  { value: "radar", label: "Radar" },
];

const timeRanges = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
];

const CryptoChart = ({ data: coins2 }) => {
  const [selectedCurrencies, setSelectedCurrencies] = useState([currencyOptions[0]]);
  const [selectedChartType, setSelectedChartType] = useState(chartTypes[0]);
  const [chartData, setChartData] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[4].value); // Default to 6M

  useEffect(() => {
    if (coins2 && selectedCurrencies.length > 0) {
      const datasets = selectedCurrencies.map((currency) => {
        const data = coins2[currency.value] || {};
        return {
          label: currency.label,
          data: generateData(selectedTimeRange, data),
          borderColor: getRandomColor(),
          backgroundColor: selectedChartType.value === "bar" ? getRandomColor() : "rgba(75,192,192,0.2)",
          fill: selectedChartType.value !== 'bar', // Only fill for non-bar charts
        };
      });
      setChartData({
        labels: generateLabels(selectedTimeRange),
        datasets,
      });
    }
  }, [coins2, selectedCurrencies, selectedTimeRange, selectedChartType]);

  const handleCurrencyChange = (selectedOptions) => {
    setSelectedCurrencies(selectedOptions || []);
  };

  const handleChartTypeChange = (selectedOption) => {
    setSelectedChartType(selectedOption || chartTypes[0]);
  };

  const handleTimeRangeChange = (timeRange) => {
    setSelectedTimeRange(timeRange);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateLabels = (timeRange) => {
    switch (timeRange) {
      case "1D":
        return ["00:00", "06:00", "12:00", "18:00"];
      case "1W":
        return ["1D", "2D", "3D", "4D", "5D", "6D", "7D"];
      case "1M":
        return Array.from({ length: 31 }, (_, i) => `${i + 1}D`);
      case "3M":
        return ["Jan", "Feb", "Mar"];
      case "6M":
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      case "1Y":
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      default:
        return [];
    }
  };

  const generateData = (timeRange, data) => {
    switch (timeRange) {
      case "1D":
        return ["00:00", "06:00", "12:00", "18:00"].map((_, i) => data[`hour${i * 6}`] || 0);
      case "1W":
        return Array.from({ length: 7 }, (_, i) => data[`day${i + 1}`] || 0);
      case "1M":
        return Array.from({ length: 31 }, (_, i) => data[`day${i + 1}`] || 0);
      case "3M":
        return ["Jan", "Feb", "Mar"].map((month) => data[month] || 0);
      case "6M":
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => data[month] || 0);
      case "1Y":
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => data[month] || 0);
      default:
        return [];
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 20,
          boxWidth: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const datasetLabel = tooltipItem.dataset.label || "";
            return `${datasetLabel}: ${tooltipItem.formattedValue}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `${value / 1000}k`;
          },
        },
      },
    },
  };

  const renderChart = () => {
    switch (selectedChartType.value) {
      case "bar":
        return <Bar data={chartData} options={options} />;
      case "radar":
        return <Radar data={chartData} options={options} />;
      case "line":
      default:
        return <Line data={chartData} options={options} />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 mb-4 flex-nowrap">
        <div className="flex gap-2 flex-nowrap">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleTimeRangeChange(range.value)}
              className={`py-1 px-3 border rounded-md ${selectedTimeRange === range.value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} portfolio-text`}
            >
              {range.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-nowrap">
          <Select
            isMulti
            options={currencyOptions}
            onChange={handleCurrencyChange}
            value={selectedCurrencies}
            className="select-normal portfolio-text select-graph"
            styles={{
              control: (base, state) => ({
                ...base,
                width: state.hasValue && state.selectProps.value.length > 1 ? 'auto' : '12rem', // Adjust the width based on the number of selected values
              }),
            }}
          />
          <Select
            options={chartTypes}
            onChange={handleChartTypeChange}
            value={selectedChartType}
            className="select-normal portfolio-text select-width"
            styles={{
              control: (base) => ({
                ...base,
                width: '5rem', // Default width
              }),
            }}
          />
        </div>
      </div>
      <div className="chart-container h-48 overflow-hidden">{chartData && renderChart()}</div>
    </div>
  );
};

export default CryptoChart;
