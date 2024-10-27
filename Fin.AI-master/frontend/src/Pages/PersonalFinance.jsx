import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, DollarSign, TrendingUp, AlertCircle, Target, Shield, UserPlus, ThumbsUp, ArrowRight, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PersonalFinancePage = () => {
  const [userInfo, setUserInfo] = useState({
    age: '',
    retirementAge: '',
    annualIncome: '',
    jobStability: '',
    majorExpenses: '',
    outstandingDebts: '',
    shortTermGoals: '',
    longTermGoals: '',
    savingsAndInvestments: '',
    riskTolerance: '',
    dependents: '',
    insuranceCoverage: '',
    expectedLifeChanges: ''
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/personal-finance/plan', userInfo);
      const formattedAnalysis = {
        ...response.data.data,
        analysis: response.data.data.analysis
          .replace(/\*\*(.*?)\*\*/g, '<br><br><strong>$1</strong><br>')
      };
      setAnalysis(formattedAnalysis);
    } catch (err) {
      setError('Failed to fetch analysis. Please try again.');
      console.error('Error fetching analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionForm = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField name="age" label="Age" prompt="Enter your current age" icon={<UserPlus />} />
        <InputField name="retirementAge" label="Desired Retirement Age" prompt="At what age do you plan to retire?" icon={<ThumbsUp />} />
        <InputField name="annualIncome" label="Annual Income" prompt="Your total yearly income before taxes" icon={<DollarSign />} />
        <InputField name="jobStability" label="Job Stability (1-10)" prompt="How stable is your current job? (1 = very unstable, 10 = very stable)" icon={<TrendingUp />} />
        <InputField name="majorExpenses" label="Major Monthly Expenses" prompt="Sum of your significant monthly costs (e.g., rent, utilities, car payments)" icon={<CreditCard />} />
        <InputField name="outstandingDebts" label="Outstanding Debts" prompt="Total amount of all your current debts" icon={<AlertCircle />} />
        <InputField name="shortTermGoals" label="Short-term Financial Goals" prompt="Financial objectives for the next 1-3 years" icon={<Target />} />
        <InputField name="longTermGoals" label="Long-term Financial Goals" prompt="Financial objectives for 5+ years from now" icon={<Target />} />
        <InputField name="savingsAndInvestments" label="Current Savings and Investments" prompt="Total value of your savings accounts and investment portfolio" icon={<DollarSign />} />
        <InputField name="riskTolerance" label="Risk Tolerance (1-10)" prompt="How comfortable are you with financial risk? (1 = very conservative, 10 = very aggressive)" icon={<TrendingUp />} />
        <InputField name="dependents" label="Number of Dependents" prompt="How many people rely on you financially?" icon={<UserPlus />} />
        <InputField name="insuranceCoverage" label="Current Insurance Coverage" prompt="Types of insurance you currently have (e.g., life, health, property)" icon={<Shield />} />
        <InputField name="expectedLifeChanges" label="Expected Major Life Changes" prompt="Any significant life events you anticipate in the near future" icon={<AlertCircle />} />
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 flex items-center"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Get Your Financial Plan'}
          {!loading && <ArrowRight className="ml-2" />}
        </button>
      </div>
    </form>
  );

  const InputField = ({ name, label, prompt, icon }) => (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 font-semibold flex items-center text-purple-700">
        {icon && <span className="mr-2 text-pink-500">{icon}</span>}
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={userInfo[name]}
        onChange={handleInputChange}
        className="border border-purple-300 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
        required
      />
      <p className="mt-1 text-sm text-gray-600 italic">{prompt}</p>
    </div>
  );

  const renderAnalysis = () => (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Your Personal Financial Plan</h2>
      <div className="bg-white p-8 rounded-lg shadow-lg border border-purple-200">
        <div dangerouslySetInnerHTML={{ __html: analysis.analysis }} />
        <p className="mt-8 text-sm text-gray-500 italic">{analysis.disclaimer}</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-purple-900 text-white' : 'bg-purple-50 text-purple-900'} transition-colors duration-300`}>
      {/* Header with Navbar */}
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

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          <strong>Personal Finance Planning</strong>
        </h1>
        {!analysis && (
          <>
            <p className="text-center text-xl mb-8 text-gray-700">
              Take control of your financial future. Fill out the form below to receive your personalized financial plan.
            </p>
            {renderQuestionForm()}
          </>
        )}
        {loading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-xl text-purple-700">Generating your comprehensive financial plan...</p>
          </div>
        )}
        {error && <p className="text-center mt-8 text-red-600 text-xl">{error}</p>}
        {analysis && renderAnalysis()}
      </div>

      <footer className="bg-gradient-to-br from-purple-700 to-pink-500 py-12">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2024 FinInspect. Empowering financial futures.</p>
        </div>
      </footer>
    </div>
  );
};

export default PersonalFinancePage;