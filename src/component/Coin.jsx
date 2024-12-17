import React, { useEffect, useState } from 'react';
// Importing Doughnut chart from react-chartjs-2
import { Doughnut } from 'react-chartjs-2';
// Importing ChartJS modules for Doughnut chart functionality
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required Chart.js elements to enable Doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend);

// Coin Component to display a Doughnut chart for specific cryptocurrencies
const Coin = ({ coin }) => {
  // State to hold chart data
  const [chartData, setChartData] = useState(null);
  // State to hold the total volume of selected cryptocurrencies
  const [totalVolume, setTotalVolume] = useState(0);

  // Effect to process coin data when the 'coin' prop changes
  useEffect(() => {
    if (coin && coin.length > 0) {
      // Define the specific cryptocurrencies to display in the chart
      const specificCoins = ['Bitcoin', 'Ethereum', 'Tether', 'BNB', 'Solana'];
      
      // Filter the coins array to include only the defined cryptocurrencies
      const filteredCoins = coin.filter(c => specificCoins.includes(c.name));

      // Extract names (labels) and total volume of each selected cryptocurrency
      const labels = filteredCoins.map(c => c.name); 
      const data = filteredCoins.map(c => c.total_volume);

      // Generate random colors for each section of the Doughnut chart
      const colors = filteredCoins.map(() => getRandomColor());

      // Calculate the total volume by summing up the total volume of all filtered cryptocurrencies
      const totalVolume = data.reduce((acc, volume) => acc + volume, 0);

      // Set the chart data with labels and corresponding volumes
      setChartData({
        labels, // Chart labels (coin names)
        datasets: [
          {
            data, // Data values (total volumes)
            backgroundColor: colors, // Colors for each chart segment
            hoverBackgroundColor: colors, // Colors when hovering over the segments
          },
        ],
      });

      // Update the total volume state
      setTotalVolume(totalVolume);
    }
  }, [coin]);

  // Utility function to generate a random hex color for chart segments
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'; // Hexadecimal digits
    let color = '#'; // Start with '#'
    for (let i = 0; i < 6; i++) { 
      color += letters[Math.floor(Math.random() * 16)]; // Append random hex digits
    }
    return color;
  };

  // Component UI rendering
  return (
    <div className="flex flex-col items-center w-full">
      {/* Check if chart data exists before rendering the chart */}
      {chartData && (
        <>
          {/* Container for the Doughnut chart */}
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 h-40 relative">
            <Doughnut
              data={chartData} // Pass chart data
              options={{
                maintainAspectRatio: false, // Allow chart resizing
                plugins: {
                  legend: {
                    display: false, // Hide the default legend
                  },
                },
              }}
            />
            {/* Portfolio title positioned at the top-left */}
            <div className="absolute top-0 left-0 p-2 text-sm">
              <h2 className="portfolio-text">Portfolio</h2>
            </div>
            {/* Display total volume at the top-right */}
            <div className="absolute top-0 right-0 h-0 p-2 text-sm text-right">
              Total: ${totalVolume.toLocaleString()}
            </div>
          </div>

          {/* Custom legend below the chart */}
          <div className="legend flex flex-wrap justify-center mt-8 text-xs sm:text-xs">
            {chartData.labels.map((label, index) => (
              <div key={index} className="legend-item flex items-center mb-2 mx-2">
                {/* Display a color box for each cryptocurrency */}
                <span
                  className="legend-color w-4 h-4 mr-2"
                  style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                />
                {/* Display the cryptocurrency name */}
                {label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Coin;
