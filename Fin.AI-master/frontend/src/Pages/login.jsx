import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';

const Popup = ({ message }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <p className="text-lg font-semibold text-purple-700">{message}</p>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!(email && password)) {
      setError("All input is required");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      console.log('User logged in:', userData);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/fundamentals');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("Invalid Credentials");
      } else {
        setError(err.response?.data || 'An error occurred during login');
      }
    }
  };
   
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-pink-500 flex flex-col py-6 px-6 lg:px-8 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <img src="/images/fin.ai.logo.png" alt="fin.ai logo" className="h-12 w-auto" />
        <Link to="/" className="text-white hover:text-purple-200 transition-colors duration-300 font-montserrat">
          Back to Home
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white bg-opacity-95 py-8 px-4 shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="mb-6 text-center text-3xl font-extrabold text-purple-900 font-montserrat">
              Log in to Fin.AI
            </h2>
            {error && (
              <div className="mb-4 text-red-500 text-center font-lato">{error}</div>
            )}
            <form className="space-y-4" onSubmit={handleEmailLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-700 font-montserrat">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-purple-300 rounded-md shadow-sm placeholder-purple-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-lato"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-purple-700 font-montserrat">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-purple-300 rounded-md shadow-sm placeholder-purple-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-lato"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 font-montserrat"
                >
                  Log in <LogIn className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-purple-500 font-lato">Don't have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-2 px-4 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 font-montserrat"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPopup && <Popup message="Login successful! Redirecting to dashboard..." />}
    </div>
  );
};

export default Login;