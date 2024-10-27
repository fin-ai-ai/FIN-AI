import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Loader, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import { marked } from 'marked';
import { Link } from 'react-router-dom';

const FinInspect = () => {
  const [analysisType, setAnalysisType] = useState('sector');
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

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
      const response = await axios.post('http://localhost:5000/api/finspect/analyze', {
        type: analysisType === 'sector' ? 'sector' : 'fundamental',
        input: input.trim()
      });
      
      if (response.data.success && response.data.data) {
        setAnalysis(response.data.data.analysis);
      } else {
        throw new Error(response.data.error || 'Invalid response format');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'An error occurred while fetching the analysis'
      );
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-purple-900 text-white' : 'bg-purple-50 text-purple-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/images/fin.ai.logo.png" alt="fin.ai logo" className="h-10 mr-2" />
        </div>
        <nav>
          <ul className="flex space-x-6 font-montserrat">
            <li><Link to="/" className="nav-link hover:text-pink-400 transition-colors duration-300">Home</Link></li>
            <li><Link to="/about" className="nav-link hover:text-pink-400 transition-colors duration-300">About</Link></li>
            <li><Link to="/fundamentals" className="nav-link hover:text-pink-400 transition-colors duration-300">Fundamentals</Link></li>
            <li><Link to="/fininspect" className="nav-link hover:text-pink-400 transition-colors duration-300">FinInspect</Link></li>
            <li><Link to="/personal-finance" className="nav-link hover:text-pink-400 transition-colors duration-300">Personal Finance</Link></li>
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
        
        <div className="flex justify-center mb-8">
          <button
            onClick={() => handleTypeChange('sector')}
            className={`mr-4 px-6 py-3 rounded-full ${analysisType === 'sector' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-200 text-purple-900'} transition-all duration-300 font-semibold`}
          >
            Sector Analysis
          </button>
          <button
            onClick={() => handleTypeChange('company')}
            className={`px-6 py-3 rounded-full ${analysisType === 'company' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'bg-gray-200 text-purple-900'} transition-all duration-300 font-semibold`}
          >
            Stock Analysis
          </button>
        </div>

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
          <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-purple-700">
              Analysis for {input}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <div dangerouslySetInnerHTML={renderMarkdown(analysis)} />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-br from-purple-700 to-pink-500 py-12">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2024 FinInspect. Empowering financial futures.</p>
        </div>
      </footer>
    </div>
  );
};

export default FinInspect;