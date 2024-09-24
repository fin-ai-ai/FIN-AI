import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Award, Diamond, Phone, Mail, Sun, Moon, TrendingUp, RefreshCw } from 'lucide-react';
import '../App.css';
import '../index.css';

const SubscriptionCard = ({ title, price, features, icon: Icon }) => {
  return (
    <div className="subscription-card bg-white bg-gradient-to-br from-purple-600 to-pink-500 text-purple-400 dark:text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 w-full md:w-80 flex-shrink-0 border-2 border-purple-500">
      <Icon className="w-12 h-12 mb-4 text-purple-500" />
      <h3 className="text-2xl font-bold mb-2 font-poppins">{title}</h3>
      <p className="text-3xl font-bold mb-4 font-montserrat">${price}<span className="text-sm">/month</span></p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center font-lato">
            <TrendingUp className="mr-2 text-purple-500" /> {feature}
          </li>
        ))}
      </ul>
      <button className="cta-button mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300">
        Choose Plan
      </button>
    </div>
  );
};
const StockTable = ({ stocks, onCompanyClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">S.No</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">CMP</th>
            <th className="px-4 py-2">P/E</th>
            <th className="px-4 py-2">Mar Cap</th>
            <th className="px-4 py-2">Div Yld</th>
            <th className="px-4 py-2">NP Qtr</th>
            <th className="px-4 py-2">Qtr Profit Var</th>
            <th className="px-4 py-2">Sales Qtr</th>
            <th className="px-4 py-2">Qtr Sales Var</th>
            <th className="px-4 py-2">ROCE</th>
            <th className="px-4 py-2">PAT Qtr</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{stock['S.No']}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onCompanyClick(stock.Name)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  {stock.Name}
                </button>
              </td>
              <td className="border px-4 py-2">{stock.CMP}</td>
              <td className="border px-4 py-2">{stock['P/E']}</td>
              <td className="border px-4 py-2">{stock['Mar Cap']}</td>
              <td className="border px-4 py-2">{stock['Div Yld']}</td>
              <td className="border px-4 py-2">{stock['NP Qtr']}</td>
              <td className="border px-4 py-2">{stock['Qtr Profit Var']}</td>
              <td className="border px-4 py-2">{stock['Sales Qtr']}</td>
              <td className="border px-4 py-2">{stock['Qtr Sales Var']}</td>
              <td className="border px-4 py-2">{stock.ROCE}</td>
              <td className="border px-4 py-2">{stock['PAT Qtr']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FinAiHomepage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleStartJourney = () => {
    navigate('/login');
  };

  const handleFundamentals = () => {
    navigate('/fundamentals');
  };

  const handleFinInspect = () => {
    navigate('/fininspect');
  };

  const handleCompanyClick = (companyName) => {
    navigate(`/fundamentals/${encodeURIComponent(companyName)}`);
  };

  const fetchStockData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/api/stocks');
      setStocks(response.data.stocks);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError(`Failed to load stock data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-purple-900 text-white' : 'bg-purple-50 text-purple-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/images/fin.ai.logo.png" alt="fin.ai logo" className="h-10 mr-2" />
        </div>
        <nav>
          <ul className="flex space-x-6 font-montserrat">
            <li><a href="#" className="nav-link hover:text-pink-400 transition-colors duration-300">Home</a></li>
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

      {/* Hero Section */}
      <section className="container mx-auto text-center py-20 px-4">
        <h1 className="hero-title text-6xl font-bold mb-4 font-poppins animate-fade-in-down">
          Unlock Financial Intelligence with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">fin.ai</span>
        </h1>
        <p className="hero-subtitle text-xl mb-8 font-lato animate-fade-in-up">
          Harness the power of AI to transform your financial decision-making
        </p>
        <button 
          onClick={handleStartJourney}
          className="cta-button bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 animate-pulse"
        >
          Start Your Journey
        </button>
      </section>

      {/* Stock Data Section */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 font-poppins animate-fade-in-down text-purple-600">
          Latest Stock Data
        </h2>
        {isLoading ? (
          <div className="text-center">Loading stock data...</div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchStockData}
              className="bg-purple-600 text-white px-4 py-2 rounded-full flex items-center mx-auto"
            >
              <RefreshCw className="mr-2" /> Retry
            </button>
          </div>
        ) : stocks.length > 0 ? (
          <StockTable stocks={stocks} onCompanyClick={handleCompanyClick} />
        ) : (
          <div className="text-center">No stock data available.</div>
        )}
      </section>

      {/* Subscription Models */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 font-poppins animate-fade-in-down text-purple-600">
          Choose Your Path to Financial Excellence
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-stretch space-y-8 md:space-y-0 md:space-x-8 overflow-x-auto">
          <SubscriptionCard 
            title="Silver Insights"
            price={29}
            features={["AI-powered financial analysis", "Weekly performance reports", "Email support within 24 hours", "Basic portfolio optimization"]}
            icon={CreditCard}
          />
          <SubscriptionCard 
            title="Gold Prosperity"
            price={59}
            features={["Advanced AI financial insights", "Daily market analysis", "Priority email support", "API access for custom integrations", "Automated tax optimization"]}
            icon={Award}
          />
          <SubscriptionCard 
            title="Platinum Mastery"
            price={99}
            features={["Full AI financial suite", "Real-time analytics dashboard", "24/7 phone & chat support", "Custom AI model training", "Dedicated financial advisor", "Exclusive investment opportunities"]}
            icon={Diamond}
          />
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gradient-to-br from-purple-700 to-pink-500 py-12 transition-colors duration-300">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <div className="mb-4 md:mb-0">
            <img src="/images/fin.ai.logo.png" alt="fin.ai logo" className="h-10 mr-2" />
            <p className="font-lato text-white">&copy; 2024 fin.ai. Empowering financial futures.</p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="contact-info flex items-center mb-2 text-white hover:text-pink-300 transition-colors duration-300">
              <Phone className="mr-2" />
              <span className="font-montserrat">7992261246</span>
            </div>
            <div className="contact-info flex items-center text-white hover:text-pink-300 transition-colors duration-300">
              <Mail className="mr-2" />
              <span className="font-montserrat">fin.aiventures@gmail.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FinAiHomepage;