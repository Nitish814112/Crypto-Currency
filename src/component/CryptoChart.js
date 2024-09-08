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

const CryptoChart = ({ data, selectedCurrencies }) => {
  const [selectedChartType, setSelectedChartType] = useState(chartTypes[0]);
  const [chartData, setChartData] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(
    timeRanges[4].value
  ); // Default to 6M

  useEffect(() => {
    if (data && selectedCurrencies.length > 0) {
      const datasets = selectedCurrencies.map((currency, index) => {
        const currencyData = data[currency] || {};

        return {
          label: currency, // Use currency.value for the label
          data: generateData(selectedTimeRange, currencyData),
          borderColor: getRandomColor(),
          backgroundColor:
            selectedChartType.value === "bar"
              ? getRandomColor()
              : "rgba(75,192,192,0.2)",
          fill: selectedChartType.value !== "bar", // Only fill for non-bar charts
          yAxisID: `y-axis-${index}`, // Assign a unique ID for the y-axis
        };
      });

      // Create chart data
      setChartData({
        labels: generateLabels(selectedTimeRange),
        datasets,
      });
    }
  }, [data, selectedCurrencies, selectedTimeRange, selectedChartType]);

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
          color: "black", // This property ensures the color is applied to the legend text
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
      x: {
        ticks: {
          color: "black", // Color for x-axis text
          font: {
            weight: "bold", // Make x-axis text bold
          },
        },
        title: {
          display: true,
          text: "Time", // X-axis label
          color: "black",
          font: {
            weight: "bold",
            size: 14,
          },
        },
      },
      y: selectedCurrencies.map((_, index) => ({
        id: `y-axis-${index}`,
        position: index === 0 ? "left" : "right", // Position the first y-axis on the left, others on the right
        ticks: {
          callback: function (value) {
            return `${value / 1000}k`; // Format the ticks
          },
          color: "black", // Color for y-axis text
          font: {
            weight: "bold", // Make y-axis text bold
          },
        },
        afterBuildTicks: (scale) => {
          scale.ticks.forEach((tick) => {
            tick.color = "black";
            tick.font = {
              weight: "bold",
            };
          });
        },
        title: {
          display: true,
          text: `Currency ${index + 1}`, // Y-axis label
          color: "black",
          font: {
            weight: "bold",
            size: 14,
          },
        },
      })),
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
        <div
          style={{ color: "black" }}
          className="flex flex-col items-center w-full"
        >
          <div className="flex gap-2 flex-nowrap select-curr justify-center">
            <Select
              options={chartTypes}
              onChange={handleChartTypeChange}
              value={selectedChartType}
              className="select-normal portfolio-text select-width"
              styles={{
                control: (base) => ({
                  ...base,
                  width: "5rem",
                }),
                
                
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{ color: "black" }}
        className="chart-container h-48 overflow-hidden"
      >
        {chartData && renderChart()}
      </div>
    </div>
  );
};

export default CryptoChart;
