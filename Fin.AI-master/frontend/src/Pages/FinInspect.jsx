import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Loader, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import { marked } from 'marked';
import { Link, useNavigate } from 'react-router-dom';
import OnboardingTour from '../components/OnboardingTour';
import { finInspectTourSteps } from '../config/tourSteps';

const FinInspect = () => {
  const [analysisType, setAnalysisType] = useState('sector');
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');
  const [currentPlan, setCurrentPlan] = useState('free');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setCurrentPlan(user.subscriptionType || 'free');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to use this feature');
        navigate('/login');
        return;
      }

      if (analysisType === 'sector' && !['gold', 'diamond'].includes(currentPlan)) {
        setError(
          <div className="text-center">
            <p className="mb-4">Sector Analysis requires a Gold or higher subscription plan.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition-duration-300"
            >
              Upgrade Plan
            </button>
          </div>
        );
        setLoading(false);
        return;
      }

      if (analysisType === 'company' && !['bronze', 'silver', 'gold', 'diamond'].includes(currentPlan)) {
        setError(
          <div className="text-center">
            <p className="mb-4">Stock Analysis requires a Bronze or higher subscription plan.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition-duration-300"
            >
              Upgrade Plan
            </button>
          </div>
        );
        setLoading(false);
        return;
      }

      const endpoint = analysisType === 'sector' 
        ? 'http://localhost:5000/api/finspect/analyze/sector'
        : 'http://localhost:5000/api/finspect/analyze/fundamental';

      const response = await axios.post(
        endpoint,
        { input: input.trim() },
        {
          headers: { 
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success && response.data.data) {
        setAnalysis(response.data.data.analysis);
      } else {
        throw new Error(response.data.error || 'Invalid response format');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
        return;
      }

      if (err.response?.status === 403) {
        setError(
          <div className="text-center">
            <p className="mb-4">
              {analysisType === 'sector' 
                ? 'Sector Analysis requires a Gold or higher subscription plan.'
                : 'Stock Analysis requires a Bronze or higher subscription plan.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition-duration-300"
            >
              Upgrade Plan
            </button>
          </div>
        );
      } else {
        setError(
          err.response?.data?.error || 
          err.message || 
          'An error occurred while fetching the analysis'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = useCallback(() => {
    setInput('');
    setAnalysis('');
    setError('');
  }, []);

  const handleTypeChange = useCallback((type) => {
    setAnalysisType(type);
    setInput('');
    setAnalysis('');
    setError('');
  }, []);

  const renderMarkdown = useCallback((content) => {
    try {
      return { __html: marked(content, { 
        gfm: true, 
        breaks: true,
        headerIds: false,
        sanitize: true
      })};
    } catch (err) {
      console.error('Markdown parsing error:', err);
      return { __html: content };
    }
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-purple-900 text-white' : 'bg-purple-50 text-[rgb(88,28,135)]'} transition-colors duration-300`}>
      <OnboardingTour steps={finInspectTourSteps} pageName="finInspect" />

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

      <main className="container mx-auto py-20 px-4">
        <h1 className="text-5xl font-bold text-center mb-12 animate-fade-in-down">
          AI-Powered Financial Analysis
        </h1>
        
        <div className="analysis-type-section flex justify-center mb-8">
          <button
            onClick={() => handleTypeChange('sector')}
            className={`mr-4 px-6 py-3 rounded-full ${analysisType === 'sector' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-200 text-purple-900'} transition-all duration-300 font-semibold`}
          >
            Sector Analysis {!['gold', 'diamond'].includes(currentPlan) && '(Gold+)'}
          </button>
          <button
            onClick={() => handleTypeChange('company')}
            className={`px-6 py-3 rounded-full ${analysisType === 'company' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-200 text-purple-900'} transition-all duration-300 font-semibold`}
          >
            Stock Analysis {!['bronze', 'silver', 'gold', 'diamond'].includes(currentPlan) && '(Bronze+)'}
          </button>
        </div>

        <div className="input-section">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center border-b-2 border-purple-500 py-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder={
                  analysisType === 'sector' 
                    ? "Enter sector name (e.g., Technology, Healthcare)" 
                    : "Enter company name (e.g., Tata Motors, Infosys)"
                }
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? <Loader className="animate-spin" /> : <ArrowRight />}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 flex-shrink-0 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full transition-all duration-300"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-8 max-w-2xl mx-auto" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center mb-8">
            <Loader className="animate-spin text-purple-500" size={48} />
          </div>
        )}

        {analysis && (
          <div className={`shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-4xl mx-auto ${theme === 'dark' ? 'bg-purple-800' : 'bg-white'}`}>
            <h2 className="text-3xl font-bold mb-6 text-center">
              Analysis for {input}
            </h2>
            <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
              <div dangerouslySetInnerHTML={renderMarkdown(analysis)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FinInspect;