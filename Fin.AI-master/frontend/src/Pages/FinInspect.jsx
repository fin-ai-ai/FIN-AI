import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown } from 'lucide-react';

const FinInspect = () => {
  const [topStocks, setTopStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fininspect/top-stocks');
        setTopStocks(response.data);
      } catch (err) {
        console.error('Error fetching top stocks:', err);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopStocks();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 transition-colors duration-300">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center bg-gradient-to-br from-purple-700 to-pink-500 text-white">
        <div className="flex items-center">
          <img src="/images/fin.ai.logo.png" alt="fin.ai logo" className="h-10 mr-2" />
          <h1 className="text-2xl font-bold">FinInspect</h1>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Top 10 Stocks</h1>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 border-b">Rank</th>
              <th className="py-3 px-4 border-b">Stock Symbol</th>
              <th className="py-3 px-4 border-b">Company Name</th>
              <th className="py-3 px-4 border-b">Price</th>
              <th className="py-3 px-4 border-b">Change</th>
              <th className="py-3 px-4 border-b">Percentage Change</th>
              <th className="py-3 px-4 border-b">P/E Ratio</th>
              <th className="py-3 px-4 border-b">Dividend Yield</th>
            </tr>
          </thead>
          <tbody>
            {topStocks.map((stock, index) => (
              <tr key={stock.symbol} className="text-center border-b">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{stock.symbol}</td>
                <td className="py-3 px-4">{stock.companyName}</td>
                <td className="py-3 px-4">${stock.price.toFixed(2)}</td>
                <td className={`py-3 px-4 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change.toFixed(2)}
                </td>
                <td className={`py-3 px-4 ${stock.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.percentageChange.toFixed(2)}%
                </td>
                <td className="py-3 px-4">{stock.peRatio.toFixed(2)}</td>
                <td className="py-3 px-4">{(stock.dividendYield * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer className="bg-gradient-to-br from-purple-700 to-pink-500 py-6 text-center text-white">
        <p>&copy; 2024 fin.ai. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FinInspect;
