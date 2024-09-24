import React, { useState, useEffect, useCallback } from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FundamentalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleFundamentals = () => {
    navigate('/fundamentals');
  };

  const handleFinInspect = () => {
    navigate('/fininspect');
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const loadTradingViewWidget = useCallback((symbol) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        width: "100%",
        height: 500,
        symbol: symbol,
        interval: 'D',
        timezone: 'Asia/Kolkata',
        theme: 'light',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview-widget',
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
        hide_side_toolbar: false,
        withdateranges: true,
        hide_volume: false,
      });
    };

    const widgetContainer = document.getElementById('tradingview-widget');
    widgetContainer.innerHTML = '';
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      loadTradingViewWidget(searchTerm.toUpperCase());
    }
  }, [searchTerm, loadTradingViewWidget]);

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

  const renderBalanceSheet = (balanceSheet) => {
    if (!balanceSheet || Object.keys(balanceSheet).length === 0) return null;

    const metrics = Object.keys(balanceSheet);
    const years = Object.keys(balanceSheet[metrics[0]]);

    return (
      <div className="overflow-x-auto mt-6">
        <h3 className="font-semibold text-lg mb-4">Balance Sheet:</h3>
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                Metric
              </th>
              {years.map((year) => (
                <th key={year} className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => (
              <tr key={metric} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">{metric}</td>
                {years.map((year) => (
                  <td key={`${year}-${metric}`} className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                    {typeof balanceSheet[metric][year] === 'number' 
                      ? balanceSheet[metric][year].toLocaleString() 
                      : balanceSheet[metric][year] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderQuarterlyResults = (quarterlyResults) => {
    if (!quarterlyResults || quarterlyResults.length === 0) return null;
  
    const quarters = Object.keys(quarterlyResults[0]).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      return new Date(bYear, ['Mar', 'Jun', 'Sep', 'Dec'].indexOf(bMonth)) - new Date(aYear, ['Mar', 'Jun', 'Sep', 'Dec'].indexOf(aMonth));
    });
  
    const metrics = [
      'Sales', 'Expenses', 'Operating Profit', 'OPM', 'Other Income', 'Interest',
      'Depreciation', 'PBT', 'Tax', 'Net Profit', 'EPS'
    ];
  
    return (
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                Metric
              </th>
              {quarters.map((quarter) => (
                <th key={quarter} className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                  {quarter}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => (
              <tr key={metric} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">{metric}</td>
                {quarters.map((quarter) => {
                  const value = quarterlyResults[index][quarter];
                  return (
                    <td key={`${metric}-${quarter}`} className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                      {typeof value === 'number' 
                        ? value.toLocaleString() 
                        : value || '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderStockData = (data) => {
    const excludeKeys = ['name', 'quarterlyResults', 'about', 'balanceSheet', 'evaluation'];
    const stockInfo = Object.entries(data).filter(([key]) => !excludeKeys.includes(key));

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                Metric
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {stockInfo.map(([key, value], index) => (
              <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">{key}</td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderEvaluationResults = () => {
    if (!stockData || !stockData.evaluation) return null;

    const { scores, overall_score, evaluation } = stockData.evaluation;

    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 font-poppins">Stock Evaluation</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 font-montserrat text-sm">
          {Object.entries(scores).map(([key, value]) => (
            <div key={key} className="border-b border-gray-200 pb-2">
              <p className="font-semibold text-base">{key.replace(/_/g, ' ')}:</p>
              <p className="text-base">{value !== null ? value.toFixed(2) : 'N/A'}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="font-semibold text-lg">Overall Score: <span className="font-normal">{overall_score !== null ? overall_score.toFixed(2) : 'N/A'}</span></p>
          <p className="font-semibold text-lg">Evaluation: <span className="font-normal">{evaluation}</span></p>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-purple-900 text-white' : 'bg-purple-50 text-purple-900'} transition-colors duration-300`}>
      {/* Navbar */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/images/fin.ai.logo.png" alt="fin.ai logo" className="h-10 mr-2" />
        </div>
        <nav>
          <ul className="flex space-x-6 font-montserrat">
            <li><a href="/" className="nav-link hover:text-pink-400 transition-colors duration-300">Home</a></li>
            <li><a href="#" className="nav-link hover:text-pink-400 transition-colors duration-300">About</a></li>
            <li><a href="#" onClick={handleFundamentals} className="nav-link hover:text-pink-400 transition-colors duration-300">Fundamentals</a></li>
            <li><a href="#" onClick={handleFinInspect} className="nav-link hover:text-pink-400 transition-colors duration-300">FinSpect</a></li>
            <li>
              <button onClick={toggleTheme} className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white transition-colors duration-300">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="container mx-auto py-4 px-4">
        <h1 className="text-3xl font-bold mb-4 font-poppins text-center">Stock Fundamentals</h1>

        <form onSubmit={handleSearch} className="mb-4 max-w-md mx-auto">
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

        {searchTerm && (
          <div className="bg-white shadow-lg rounded-lg p-2 mb-6">
            <div id="tradingview-widget"></div>
          </div>
        )}

        {stockData && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 font-poppins">{stockData.name} Fundamentals</h2>

            {renderStockData(stockData)}

            <button
              onClick={() => setShowModal(true)}
              className="mt-6 mb-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:from-purple-700 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              FinSpect
            </button>

            {stockData.quarterlyResults && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4">Quarterly Results:</h3>
                {renderQuarterlyResults(stockData.quarterlyResults)}
              </div>
            )}

            {stockData.balanceSheet && renderBalanceSheet(stockData.balanceSheet)}

            {stockData.about && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">About:</h3>
                <p className="text-base">{stockData.about}</p>
              </div>
            )}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">FinSpect</h2>
              {renderEvaluationResults()}
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundamentalsPage;