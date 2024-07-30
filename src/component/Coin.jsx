import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Coin = ({ coin }) => {
  const [chartData, setChartData] = useState(null);
  const [totalVolume, setTotalVolume] = useState(0);

  useEffect(() => {
    if (coin && coin.length > 0) {
      // Define the specific cryptocurrencies to display
      const specificCoins = ['Bitcoin', 'Ethereum', 'Tether', 'BNB'];
      
      // Filter the coin array to include only the specific cryptocurrencies
      const filteredCoins = coin.filter(c => specificCoins.includes(c.name));

      const labels = filteredCoins.map(c => c.name);
      const data = filteredCoins.map(c => c.total_volume);
      const colors = filteredCoins.map(() => getRandomColor());
      const totalVolume = data.reduce((acc, volume) => acc + volume, 0);

      setChartData({
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            hoverBackgroundColor: colors,
          },
        ],
      });

      setTotalVolume(totalVolume);
    }
  }, [coin]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {chartData && (
        <>
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 h-40 relative">
            <Doughnut
              data={chartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
            <div className="absolute top-0 left-0 p-2 text-sm">
              <h2 className="portfolio-text">Portfolio</h2>
            </div>
            <div className="absolute top-0 right-0 h-0 p-2 text-sm text-right">
              Total: ${totalVolume.toLocaleString()}
            </div>
          </div>
          <div className="legend flex flex-wrap justify-center mt-8 text-xs sm:text-xs">
            {chartData.labels.map((label, index) => (
              <div key={index} className="legend-item flex items-center mb-2 mx-2">
                <span
                  className="legend-color w-4 h-4 mr-2"
                  style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                />
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
