import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Coins, Gem,CreditCard, Briefcase, Crown, Cloud,Phone, Mail, Sun, Moon, TrendingUp, RefreshCw, Shield } from 'lucide-react';
import '../App.css';
import '../index.css';
import OnboardingTour from '../components/OnboardingTour';
import { homeTourSteps } from '../config/tourSteps';

const SubscriptionCard = ({ title, price, features, icon: Icon, isPopular, onSubscribe, currentPlan, isLoggedIn }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl ${
      isPopular ? 'border-2 border-[rgb(88,28,135)] transform hover:-translate-y-2' : 'hover:-translate-y-1'
    }`}>
      {isPopular && (
        <div className="bg-[rgb(88,28,135)] text-white text-xs font-bold uppercase py-1 px-2 rounded-full absolute top-0 right-0 transform translate-x-2 -translate-y-2">
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
      <button 
        onClick={() => onSubscribe(title.toLowerCase())}
        disabled={!isLoggedIn || currentPlan === title.toLowerCase()}
        className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all duration-300 
          ${!isLoggedIn 
            ? 'bg-gray-400 cursor-not-allowed' 
            : currentPlan === title.toLowerCase()
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 animate-pulse shadow-lg transform hover:scale-105 border border-white/50'
              : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90'
          }`}
      >
        {!isLoggedIn 
          ? 'Login to Subscribe'
          : currentPlan === title.toLowerCase()
            ? '✨ Current Plan ✨'
            : 'Choose Plan'
        }
      </button>
    </div>
  );
};
const SubscriptionModels = ({ currentPlan, isLoggedIn, onSubscribe }) => {
  const subscriptionTypes = [
    {
      title: "Bronze",
      price: 599,
      features: [
        "Base plan",
        "FinInspect (Only stock analysis)"
      ],
      icon: Shield
    },
    {
      title: "Silver",
      price: 999,
      features: [
        "Base plan",
        "FinInspect (Stock)",
        "Personal Finance Navigator"
      ],
      icon: Coins
    },
    {
      title: "Gold",
      price: 2499,
      features: [
        "Base plan",
        "FinInspect (Stock + Sector)",
        "Personal Finance",
        "API integration (For equity trading)"
      ],
      icon: Crown,
      isPopular: true
    },
    {
      title: "Diamond",
      price: 6999,
      features: [
        "Base plan",
        "FinInspect (Stock + Sector)",
        "Personal Finance",
        "API Integration (Equity, F&O, Crypto)"
      ],
      icon: Gem
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-[rgb(88,28,135)]">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {subscriptionTypes.map((sub) => (
            <SubscriptionCard 
              key={sub.title}
              {...sub}
              currentPlan={currentPlan}
              isLoggedIn={isLoggedIn}
              onSubscribe={onSubscribe}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
const StockTable = ({ stocks, onCompanyClick }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-6">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <th className="px-6 py-4 rounded-tl-lg">S.No</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">CMP</th>
            <th className="px-6 py-4">P/E</th>
            <th className="px-6 py-4">Mar Cap</th>
            <th className="px-6 py-4">Div Yld</th>
            <th className="px-6 py-4">NP Qtr</th>
            <th className="px-6 py-4">Qtr Profit Var</th>
            <th className="px-6 py-4">Sales Qtr</th>
            <th className="px-6 py-4">Qtr Sales Var</th>
            <th className="px-6 py-4">ROCE</th>
            <th className="px-6 py-4 rounded-tr-lg">PAT Qtr</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-100">
          {stocks.map((stock, index) => (
            <tr key={index} className="hover:bg-purple-50 transition-colors duration-200">
              <td className="px-6 py-4 text-center">{stock['S.No']}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onCompanyClick(stock.Name)}
                  className="text-[rgb(88,28,135)] hover:text-pink-500 font-medium transition-colors duration-200"
                >
                  {stock.Name}
                </button>
              </td>
              <td className="px-6 py-4 text-center">{stock.CMP}</td>
              <td className="px-6 py-4 text-center">{stock['P/E']}</td>
              <td className="px-6 py-4 text-center">{stock['Mar Cap']}</td>
              <td className="px-6 py-4 text-center">{stock['Div Yld']}</td>
              <td className="px-6 py-4 text-center">{stock['NP Qtr']}</td>
              <td className="px-6 py-4 text-center">{stock['Qtr Profit Var']}</td>
              <td className="px-6 py-4 text-center">{stock['Sales Qtr']}</td>
              <td className="px-6 py-4 text-center">{stock['Qtr Sales Var']}</td>
              <td className="px-6 py-4 text-center">{stock.ROCE}</td>
              <td className="px-6 py-4 text-center">{stock['PAT Qtr']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const NewsSection = ({ newsItems }) => {
  return (
    <div className="bg-white/95 py-12 rounded-xl shadow-lg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div key={index} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-[rgb(88,28,135)] line-clamp-2 hover:text-purple-700 transition-colors">
                  {item.name}
                </h3>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out font-medium group hover:opacity-90"
                >
                  Read more 
                  <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
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
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

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

  useEffect(() => {
    // Check for logged in user
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setCurrentPlan(user.subscriptionType || 'free');
    }

    // Fetch current subscription if user is logged in
    const fetchSubscriptionStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/subscription/status', {
          headers: { 'Authorization': token }
        });

        if (response.data.success) {
          setCurrentPlan(response.data.data.subscriptionType);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleSubscriptionUpdate = async (type) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setSubscriptionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/subscription/update',
        { subscriptionType: type },
        { 
          headers: { 
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setCurrentPlan(type);
        // Update user data in localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        userData.subscriptionType = type;
        localStorage.setItem('userData', JSON.stringify(userData));
        
        alert(`Successfully upgraded to ${type} subscription!`);
      }
    } catch (error) {
      console.error('Subscription update error:', error);
      alert(error.response?.data?.message || 'Failed to update subscription');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-purple-900 text-white' : 'bg-purple-50 text-[rgb(88,28,135)]'} transition-colors duration-300`}>
      {/* Add OnboardingTour */}
      <OnboardingTour steps={homeTourSteps} pageName="home" />

      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/images/fin.ai.logo.png" alt="Fin.AI logo" className="h-10 mr-2" />
        </div>
        <nav>
          <ul className="flex space-x-6 font-montserrat items-center">
            <li>
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="nav-link hover:text-pink-400 transition-colors duration-300"
              >
                Home
              </button>
            </li>
            <li>
              <Link to="/about" className="nav-link hover:text-pink-400 transition-colors duration-300">About</Link>
            </li>
            <li>
              <Link to="/fundamentals" className="nav-link hover:text-pink-400 transition-colors duration-300">Fundamentals</Link>
            </li>
            <li>
              <Link to="/fininspect" className="nav-link hover:text-pink-400 transition-colors duration-300">FinInspect</Link>
            </li>
            <li>
              <Link to="/personal-finance" className="nav-link hover:text-pink-400 transition-colors duration-300">Personal Finance</Link>
            </li>
            {currentUser ? (
              <li className="flex items-center space-x-4">
                <Link 
                  to="/dashboard"
                  className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full hover:opacity-90 transition-duration-300"
                >
                  Dashboard
                </Link>
                <span className="px-2 py-1 bg-purple-200 text-[rgb(88,28,135)] rounded-full text-xs">
                  {currentPlan.toUpperCase()}
                </span>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    setCurrentUser(null);
                    setCurrentPlan('free');
                    navigate('/');
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-[rgb(88,28,135)] text-white px-4 py-2 rounded-full hover:opacity-90"
                >
                  Login
                </button>
              </li>
            )}
            <li>
              <button onClick={toggleTheme} className="p-2 rounded-full bg-gradient-to-r from-[rgb(88,28,135)] to-pink-500 text-white">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </li>
          </ul>
        </nav>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto text-center py-12 px-4">
        <h1 className="hero-title text-6xl font-bold mb-4 font-poppins animate-fade-in-down text-[rgb(88,28,135)]">
          Unlock Financial Intelligence with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Fin.AI</span>
        </h1>
        <p className="hero-subtitle text-xl mb-12 font-lato animate-fade-in-up text-[rgb(88,28,135)]">
          Harness the power of AI to transform your financial decision-making
        </p>
        <button 
          onClick={handleStartJourney}
          className="cta-button bg-gradient-to-r from-purple-600 to-pink-500 text-white px-20 py-6 rounded-full text-xl font-semibold hover:opacity-90 transition-all duration-300 animate-pulse transform hover:scale-105 mt-8"
        >
          Start Your Journey
        </button>
      </section>

      {/* Stock Data Section */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 font-poppins animate-fade-in-down text-[rgb(88,28,135)]">
          Latest Stock Data
        </h2>
        {isLoading ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[rgb(88,28,135)]">Loading stock data...</p>
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchStockData}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full flex items-center mx-auto hover:opacity-90 transition-all duration-300"
            >
              <RefreshCw className="mr-2" /> Retry
            </button>
          </div>
        ) : stocks.length > 0 ? (
          <StockTable stocks={stocks} onCompanyClick={handleCompanyClick} />
        ) : (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg">
            <p className="text-[rgb(88,28,135)]">No stock data available.</p>
          </div>
        )}
      </section>
      <section id="news" className="container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 font-poppins animate-fade-in-down text-[rgb(88,28,135)]">
          Financial News
        </h2>
        {newsLoading ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[rgb(88,28,135)]">Loading news...</p>
          </div>
        ) : newsError ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg">
            <p className="text-red-500 mb-4">{newsError}</p>
            <button 
              onClick={fetchNews}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full flex items-center mx-auto hover:opacity-90 transition-all duration-300"
            >
              <RefreshCw className="mr-2" /> Retry
            </button>
          </div>
        ) : newsItems.length > 0 ? (
          <NewsSection newsItems={newsItems} />
        ) : (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg">
            <p className="text-[rgb(88,28,135)]">No news available.</p>
          </div>
        )}
      </section>
      {/* Subscription Models */}
      <SubscriptionModels 
        currentPlan={currentPlan}
        isLoggedIn={!!currentUser}
        onSubscribe={handleSubscriptionUpdate}
      />
      {/* Footer */}
      <footer className="bg-gradient-to-br from-purple-700 to-pink-500 py-12 transition-colors duration-300">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <div className="mb-4 md:mb-0">
            <img src="/images/fin.ai.logo.png" alt="Fin.AI logo" className="h-10 mr-2" />
            <p className="font-lato text-white">&copy; 2024 Fin.AI. Empowering financial futures.</p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="contact-info flex items-center mb-2 text-white hover:text-pink-300 transition-colors duration-300">
              <Phone className="mr-2" />
              <span className="font-montserrat">7992261246</span>
            </div>
            <div className="contact-info flex items-center text-white hover:text-pink-300 transition-colors duration-300">
              <Mail className="mr-2" />
              <span className="font-montserrat">Fin.AIventures@gmail.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FinAiHomepage;