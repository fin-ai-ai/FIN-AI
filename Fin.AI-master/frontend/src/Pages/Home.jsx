import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Coins, Gem,CreditCard, Briefcase, Crown, Cloud,Phone, Mail, Sun, Moon, TrendingUp, RefreshCw, Shield } from 'lucide-react';
import '../App.css';
import '../index.css';

const SubscriptionCard = ({ title, price, features, icon: Icon, isPopular }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl ${isPopular ? 'border-2 border-purple-500 transform hover:-translate-y-2' : 'hover:-translate-y-1'}`}>
      {isPopular && (
        <div className="bg-purple-500 text-white text-xs font-bold uppercase py-1 px-2 rounded-full absolute top-0 right-0 transform translate-x-2 -translate-y-2">
          Most Popular
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-12 h-12 ${isPopular ? 'text-purple-500' : 'text-gray-500'}`} />
        <h3 className={`text-2xl font-bold ${isPopular ? 'text-purple-600' : 'text-gray-800'}`}>{title}</h3>
      </div>
      <p className="text-3xl font-bold mb-6 text-gray-800">₹{price}<span className="text-xl font-normal">/mo</span></p>
      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors duration-300 ${isPopular ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
       Choose Plan
      </button>
    </div>
  );
};
const SubscriptionModels = () => {
  return (
    <section className="py-20 px-4 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <SubscriptionCard 
            title="Bronze"
            price={599}
            features={[
              "Base plan",
              "FinInspect (Only stock analysis)"
            ]}
            icon={Shield}
          />
          <SubscriptionCard 
            title="Silver"
            price={999}
            features={[
              "Base plan",
              "FinInspect (Stock)",
              "Personal Finance Navigator"
            ]}
            icon={Coins}
          />
          <SubscriptionCard 
            title="Gold"
            price={2499}
            features={[
              "Base plan",
              "FinInspect (Stock + Sector)",
              "Personal Finance",
              "API integration (For equity trading)"
            ]}
            icon={Crown}
            isPopular={true}
          />
          <SubscriptionCard 
            title="Diamond"
            price={6999}
            features={[
              "Base plan",
              "FinInspect (Stock + Sector)",
              "Personal Finance",
              "API Integration (Equity, F&O, Crypto)"
            ]}
            icon={Gem}
          />
        </div>
      </div>
    </section>
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
const NewsSection = ({ newsItems }) => {
  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                  {item.name}
                </h3>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const FinAiHomepage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);

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
  const handlePersonalFinance = () => {
    navigate('/personal-finance');
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
  const fetchNews = async () => {
    setNewsLoading(true);
    setNewsError(null);

    try {
      const response = await axios.get('http://localhost:5000/api/news');
      setNewsItems(response.data.newsItems);
      setNewsLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      setNewsError('Failed to fetch news. Please try again later.');
      setNewsLoading(false);
    }
  };
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    fetchStockData();
    fetchNews();
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
            <li><a href="#" onClick={handleFinInspect} className="nav-link hover:text-pink-400 transition-colors duration-300">FinInspect</a></li>
            <li><a href="#" onClick={handlePersonalFinance} className="nav-link hover:text-pink-400 transition-colors duration-300">Personal Finance</a></li>
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
      <section id="news" className="container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 font-poppins animate-fade-in-down text-purple-600">
          Financial News
        </h2>
        {newsLoading ? (
          <div className="text-center">Loading news...</div>
        ) : newsError ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">{newsError}</p>
            <button 
              onClick={fetchNews}
              className="bg-purple-600 text-white px-4 py-2 rounded-full flex items-center mx-auto"
            >
              <RefreshCw className="mr-2" /> Retry
            </button>
          </div>
        ) : newsItems.length > 0 ? (
          <NewsSection newsItems={newsItems} />
        ) : (
          <div className="text-center">No news available.</div>
        )}
      </section>
      {/* Subscription Models */}
      <SubscriptionModels />
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