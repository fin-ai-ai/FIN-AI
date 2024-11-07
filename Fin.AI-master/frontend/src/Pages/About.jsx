import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Target, Shield, Cpu, Users, TrendingUp, Brain } from 'lucide-react';

const About = () => {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    // Check for logged in user
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setCurrentPlan(user.subscriptionType || 'free');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const features = [
    {
      icon: <Brain className="w-12 h-12 mb-4 text-[rgb(88,28,135)]" />,
      title: "AI-Powered Analysis",
      description: "Cutting-edge artificial intelligence algorithms provide deep insights into financial markets and investment opportunities."
    },
    {
      icon: <Target className="w-12 h-12 mb-4 text-[rgb(88,28,135)]" />,
      title: "Precision Trading",
      description: "Advanced technical analysis tools help you make informed trading decisions with greater accuracy."
    },
    {
      icon: <Shield className="w-12 h-12 mb-4 text-[rgb(88,28,135)]" />,
      title: "Secure Platform",
      description: "Bank-grade security measures protect your data and transactions with the highest level of encryption."
    },
    {
      icon: <Cpu className="w-12 h-12 mb-4 text-[rgb(88,28,135)]" />,
      title: "Real-time Processing",
      description: "Lightning-fast data processing ensures you never miss a market opportunity."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "₹100M+", label: "Trading Volume" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-purple-900 text-white' : 'bg-purple-50 text-[rgb(88,28,135)]'} transition-colors duration-300`}>
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/images/fin.ai.logo.png" alt="Fin.AI logo" className="h-10 mr-2" />
        </div>
        <nav>
          <ul className="flex space-x-6 font-montserrat items-center">
            <li>
              <Link to="/" className="nav-link hover:text-pink-400 transition-colors duration-300">Home</Link>
            </li>
            <li><Link to="/about" className="nav-link hover:text-pink-400 transition-colors duration-300">About</Link></li>
            <li><Link to="/fundamentals" className="nav-link hover:text-pink-400 transition-colors duration-300">Fundamentals</Link></li>
            <li><Link to="/fininspect" className="nav-link hover:text-pink-400 transition-colors duration-300">FinInspect</Link></li>
            <li><Link to="/personal-finance" className="nav-link hover:text-pink-400 transition-colors duration-300">Personal Finance</Link></li>
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
              <button onClick={toggleTheme} className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white transition-colors duration-300">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-6xl font-bold mb-6 animate-fade-in-down">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Fin.AI</span>
        </h1>
        <p className="text-xl mb-12 max-w-3xl mx-auto">
          Empowering investors with artificial intelligence to make smarter financial decisions. Our platform combines cutting-edge technology with financial expertise.
        </p>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
              <h3 className="text-4xl font-bold text-[rgb(88,28,135)] mb-2">{stat.number}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              {feature.icon}
              <h3 className="text-xl font-bold mb-4 text-[rgb(88,28,135)]">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto py-20 px-4">
        <div className="bg-white rounded-lg p-12 shadow-lg">
          <h2 className="text-4xl font-bold text-center mb-8 text-[rgb(88,28,135)]">Our Mission</h2>
          <p className="text-xl text-gray-600 text-center max-w-4xl mx-auto">
            At Fin.AI, we're committed to democratizing financial intelligence through innovative technology. 
            Our mission is to provide every investor, from beginners to professionals, with the tools and insights 
            they need to succeed in the financial markets.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-purple-700 to-pink-500 py-12">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2024 Fin.AI. Empowering financial futures.</p>
        </div>
      </footer>
    </div>
  );
};

export default About; 