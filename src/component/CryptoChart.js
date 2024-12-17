import React, { useState, useEffect } from "react";
import { Line, Bar, Radar } from "react-chartjs-2";
import Select from "react-select";
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

// Registering required ChartJS components
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

// Chart types available for selection
const chartTypes = [
  { value: "line", label: "Line" },
  { value: "bar", label: "Bar" },
  { value: "radar", label: "Radar" },
];

// Time range options for the chart
const timeRanges = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
];

// Main CryptoChart component
const CryptoChart = ({ data, selectedCurrencies }) => {
  const [selectedChartType, setSelectedChartType] = useState(chartTypes[0]); // Default to Line chart
  const [chartData, setChartData] = useState(null); // State to store chart data
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[4].value); // Default to 6M

  // useEffect to update chart data whenever dependencies change
  useEffect(() => {
    if (data && selectedCurrencies.length > 0) {
      // Generate datasets for selected currencies
      const datasets = selectedCurrencies.map((currency, index) => {
        const currencyData = data[currency] || {}; // Fallback if no data exists for a currency

        return {
          label: currency, // Display the currency name as the label
          data: generateData(selectedTimeRange, currencyData), // Data based on selected time range
          borderColor: getRandomColor(), // Assign random color for each dataset
          backgroundColor:
            selectedChartType.value === "bar" // Different background for bar chart
              ? getRandomColor()
              : "rgba(75,192,192,0.2)",
          fill: selectedChartType.value !== "bar", // Fill area for line and radar charts
          yAxisID: `y-axis-${index}`, // Unique y-axis ID for each dataset
        };
      });

      // Create chart data
      setChartData({
        labels: generateLabels(selectedTimeRange), // Generate labels for x-axis
        datasets, // Attach generated datasets
      });
    }
  }, [data, selectedCurrencies, selectedTimeRange, selectedChartType]);

  // Handle change in chart type selection
  const handleChartTypeChange = (selectedOption) => {
    setSelectedChartType(selectedOption || chartTypes[0]);
  };

  // Handle change in time range
  const handleTimeRangeChange = (timeRange) => {
    setSelectedTimeRange(timeRange);
  };

  // Function to generate a random color for chart elements
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Function to generate labels for the x-axis based on the selected time range
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
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      default:
        return [];
    }
  };

  // Function to extract data values for the selected time range
  const generateData = (timeRange, data) => {
    const keys = {
      "1D": ["hour0", "hour6", "hour12", "hour18"],
      "1W": ["day1", "day2", "day3", "day4", "day5", "day6", "day7"],
      "1M": Array.from({ length: 31 }, (_, i) => `day${i + 1}`),
      "3M": ["Jan", "Feb", "Mar"],
      "6M": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "1Y": [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    };
    const selectedKeys = keys[timeRange];
    return selectedKeys.map((key) => (data[key] !== undefined ? data[key] : 0));
  };

  // Chart configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          boxWidth: 20,
          font: {
            weight: "bold",
            color: "black",
          },
          color: "black", // Legend text color
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
    // Scales configuration for dynamic Y-axes
    scales: {
      x: {
        ticks: {
          color: "black",
          font: { weight: "bold" },
        },
        title: {
          display: true,
          text: "Time",
          color: "black",
          font: { weight: "bold", size: 14 },
        },
      },
      y: selectedCurrencies.map((_, index) => ({
        id: `y-axis-${index}`,
        position: index === 0 ? "left" : "right",
        ticks: {
          callback: (value) => `${value / 1000}k`, // Format Y-axis ticks
          color: "black",
          font: { weight: "bold" },
        },
        title: {
          display: true,
          text: `Currency ${index + 1}`,
          color: "black",
          font: { weight: "bold", size: 14 },
        },
      })),
    },
  };

  // Function to render the chart based on selected chart type
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
      {/* Time range and chart type selection */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-nowrap">
        <div className="flex gap-2 flex-nowrap">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleTimeRangeChange(range.value)}
              className={`py-1 px-3 border rounded-md ${
                selectedTimeRange === range.value
                  ? "bg-transparent text-yellow-700"
                  : "bg-transparent text-gray-700"
              } portfolio-text currency-btn`}
            >
              {range.label}
            </button>
          ))}
        </div>
        {/* Chart type dropdown */}
        <div className="flex flex-col items-center w-full">
          <Select
            options={chartTypes}
            onChange={handleChartTypeChange}
            value={selectedChartType}
            className="select-normal portfolio-text select-width"
          />
        </div>
      </div>

      {/* Render the chart */}
      <div className="chart-container h-48 overflow-hidden">
        {chartData && renderChart()}
      </div>
    </div>
  );
};

export default CryptoChart;
