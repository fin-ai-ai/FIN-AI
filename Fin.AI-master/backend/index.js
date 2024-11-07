const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./database/db');
const { getStockData } = require('./routes/stockDataFetcher');
const { getNewsData } = require('./routes/News');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
const authRoutes = require('./routes/auth');
const fundamentalsRoutes = require('./routes/Fundamentals');
const finspectRoutes = require('./routes/Finspect');
const personalFinanceRoutes = require('./routes/personalfinance');
const subscriptionRoutes = require('./routes/subscription'); // Add this line

// Route middlewares
app.use('/api/auth', authRoutes);
app.use('/api/fundamentals', fundamentalsRoutes);
app.use('/api/finspect', finspectRoutes);
app.use('/api/personal-finance', personalFinanceRoutes);
app.use('/api/subscription', subscriptionRoutes); // Add this line

// Add dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// News data route
app.get('/api/news', async (req, res) => {
  try {
    const newsData = await getNewsData();
    res.json(newsData);
  } catch (error) {
    console.error('Error in /api/news route:', error);
    res.status(500).json({ error: 'An error occurred while fetching news data' });
  }
});

// Stock data route
app.get('/api/stocks', async (req, res) => {
  try {
    const stockData = await getStockData();
    res.json(stockData);
  } catch (error) {
    console.error('Error in /api/stocks route:', error);
    res.status(500).json({ error: 'An error occurred while fetching stock data' });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Fin.AI API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;