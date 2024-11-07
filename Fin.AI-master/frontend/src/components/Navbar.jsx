import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

const Navbar = ({ theme, toggleTheme, currentUser, currentPlan }) => {
  const navigate = useNavigate();

  return (
    <header className="container mx-auto py-6 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/images/fin.ai.logo.png" alt="Fin.AI logo" className="h-10 mr-2" />
      </div>
      <nav>
        <ul className="flex space-x-6 font-montserrat items-center">
          <li>
            <Link to="/" className="nav-link hover:text-pink-400 transition-colors duration-300">Home</Link>
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
              <span className="text-sm">
                Welcome, {currentUser.firstname}! 
                <span className="ml-2 px-2 py-1 bg-purple-200 text-[rgb(88,28,135)] rounded-full text-xs">
                  {currentPlan.toUpperCase()}
                </span>
              </span>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('userData');
                  navigate('/');
                  window.location.reload();
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
  );
};

export default Navbar;