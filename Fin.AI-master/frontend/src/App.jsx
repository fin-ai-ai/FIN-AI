import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import Register from './Pages/Register';
import FinAiHomepage from './Pages/Home';
import About from './Pages/About';
import Fundamentals from './Pages/Fundamentals';
import FinInspect from './Pages/FinInspect';
import NewsPage from './Pages/NewsPage';
import PersonalFinancePage from './Pages/PersonalFinance';
import Dashboard from './Pages/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FinAiHomepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/fundamentals" element={<Fundamentals />} />
          <Route path="/fininspect" element={<FinInspect />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/personal-finance" element={<PersonalFinancePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;