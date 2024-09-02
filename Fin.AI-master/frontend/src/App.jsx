import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import Register from './Pages/Register';
import FinAiHomepage from './Pages/Home.jsx';
import Fundamentals from './Pages/Fundamentals';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FinAiHomepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/fundamentals" element={<Fundamentals />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;