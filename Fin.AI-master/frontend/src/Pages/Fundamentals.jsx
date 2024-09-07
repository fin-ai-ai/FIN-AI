import React, { useState } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';

const FundamentalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/fundamentals/search?ticker=${encodeURIComponent(searchTerm)}`);
      setStockData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching data. Please try again.');
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 text-purple-900 transition-colors duration-300">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 font-poppins text-center">Stock Fundamentals</h1>

        <form onSubmit={handleSearch} className="mb-8 max-w-md mx-auto">
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter stock symbol"
              className="flex-grow p-2 border border-purple-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-2 rounded-r-md hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
            >
              <Search size={24} />
            </button>
          </div>
        </form>

        {loading && <p className="text-center font-lato">Loading...</p>}
        {error && <p className="text-center text-red-500 font-lato">{error}</p>}

        {stockData && (
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-poppins">{stockData.name}</h2>
            <div className="grid grid-cols-2 gap-4 font-montserrat mb-6">
              {Object.entries(stockData).map(([key, value]) => (
                key !== 'name' && key !== 'about' && (
                  <div key={key}>
                    <p className="font-semibold">{key}:</p>
                    <p>{typeof value === 'number' ? value.toLocaleString() : value}</p>
                  </div>
                )
              ))}
            </div>

            {stockData.about && (
              <div className="mt-4">
                <p className="font-semibold">About:</p>
                <p className="text-sm">{stockData.about}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FundamentalsPage;