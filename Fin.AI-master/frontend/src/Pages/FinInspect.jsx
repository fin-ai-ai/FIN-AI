import React, { useState } from 'react';
import { ArrowRight, Loader, Sun, Moon } from 'lucide-react';
import axios from 'axios';

const FinInspect = () => {
  const [company, setCompany] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const response = await axios.post('http://localhost:5000/api/finspect/analyze', { company });
      setAnalysis(response.data.analysis);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while fetching the analysis.');
    } finally {
      setLoading(false);
    }
  };

  const formatAnalysis = (text) => {
    text = text.replace(/\*\*\*\*(.*?)\*\*\*\*/g, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\n/g, '<br>');
    return text;
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-purple-900 text-white' : 'bg-purple-50 text-purple-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/images/fin.ai.logo.png" alt="fin.ai logo" className="h-10 mr-2" />
        </div>
        <nav>
          <ul className="flex space-x-6 font-montserrat">
            <li><a href="/" className="nav-link hover:text-pink-400 transition-colors duration-300">Home</a></li>
            <li><a href="#" className="nav-link hover:text-pink-400 transition-colors duration-300">About</a></li>
            <li><a href="/fundamentals" className="nav-link hover:text-pink-400 transition-colors duration-300">Fundamentals</a></li>
            <li><a href="/fininspect" className="nav-link hover:text-pink-400 transition-colors duration-300">FinInspect</a></li>
            <li>
              <button onClick={toggleTheme} className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white transition-colors duration-300">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-20 px-4 flex-grow">
        <h1 className="text-4xl font-bold text-center mb-12 font-poppins animate-fade-in-down">
          FinInspect: AI-Powered Company Analysis
        </h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center border-b-2 border-purple-500 py-2">
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company name"
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none font-lato"
            />
            <button
              type="submit"
              disabled={loading || !company}
              className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded"
            >
              {loading ? <Loader className="animate-spin" /> : <ArrowRight />}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 max-w-2xl mx-auto" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {analysis && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-poppins">FinAlyze</h2>
            <div 
              className="text-gray-700 text-base font-lato"
              dangerouslySetInnerHTML={{ __html: formatAnalysis(analysis) }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-purple-700 to-pink-500 py-6 mt-auto">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <img src="/images/fin.ai.logo.png" alt="fin.ai logo" className="h-8 mr-2" />
            <p className="font-lato text-white text-sm">&copy; 2024 fin.ai. Empowering financial futures.</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="contact-info text-white text-sm hover:text-pink-300 transition-colors duration-300">
              <span className="font-montserrat">7992261246</span>
            </div>
            <div className="contact-info text-white text-sm hover:text-pink-300 transition-colors duration-300">
              <span className="font-montserrat">fin.aiventures@gmail.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FinInspect;