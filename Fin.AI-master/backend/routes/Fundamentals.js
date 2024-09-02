'use strict';
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { parse } = require('date-fns');

const ALPHA_VANTAGE_API_KEY = 'D3RFBVMVCQSI2LUP';
const MAX_DAILY_REQUESTS = 25;
let dailyRequests = 0;
let lastResetDate = new Date().toDateString();

function checkRateLimit() {
  const currentDate = new Date().toDateString();
  if (currentDate !== lastResetDate) {
    dailyRequests = 0;
    lastResetDate = currentDate;
  }
  
  if (dailyRequests >= MAX_DAILY_REQUESTS) {
    throw new Error('Daily API limit reached');
  }
  
  dailyRequests++;
}

router.get('/search', async (req, res) => {
  try {
    checkRateLimit();

    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ error: 'Ticker symbol is required' });
    }

    const endpoints = {
      overview: `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      globalQuote: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      dailyTimeSeries: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      marketStatus: `https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=${ALPHA_VANTAGE_API_KEY}`,
      newsSentiment: `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`
    };

    const responses = await Promise.all(Object.values(endpoints).map(endpoint => axios.get(endpoint)));

    const [overviewData, quoteData, dailyData, marketStatusData, newsData] = responses.map(response => response.data);

    if (overviewData['Error Message'] || quoteData['Information'] || !quoteData['Global Quote']) {
      if (quoteData['Information'] && quoteData['Information'].includes('API rate limit')) {
        return res.status(429).json({ error: 'API rate limit reached. Please try again later.', details: quoteData['Information'] });
      }
      
      return res.status(404).json({ error: 'Ticker symbol not found or API limit reached', details: { overviewError: overviewData['Error Message'], quoteData: quoteData } });
    }

    // Fundamental Analysis
    const fundamentalData = {
      marketCap: overviewData.MarketCapitalization,
      peRatio: overviewData.PERatio,
      dividendYield: overviewData.DividendYield,
      roe: overviewData.ReturnOnEquityTTM,
    };

    // Technical Analysis
    const dailyTimeSeries = dailyData['Time Series (Daily)'];
    const candlestickData = Object.entries(dailyTimeSeries).map(([date, { '1. open': open, '2. high': high, '3. low': low, '4. close': close, '5. volume': volume }]) => ({
      date,
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
      volume: parseFloat(volume)
    }));

    const technicalIndicators = calculateTechnicalIndicators(candlestickData);

    // Sentiment Analysis
    const sentimentAnalysis = analyzeSentiment(newsData);

    const companyData = {
      name: overviewData.Name,
      ticker: overviewData.Symbol,
      price: quoteData['Global Quote']['05. price'],
      priceChange: quoteData['Global Quote']['09. change'],
      date: new Date().toLocaleDateString(),
      website: overviewData.Website || 'N/A',
      about: overviewData.Description,
      keyPoints: fundamentalData,
      technicalIndicators,
      marketStatus: marketStatusData,
      sentiment: sentimentAnalysis,
      news: newsData
    };

    res.json(companyData);
  } catch (error) {
    if (error.message === 'Daily API limit reached') {
      return res.status(429).json({ error: 'API rate limit reached. Please try again tomorrow.' });
    }
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Failed to fetch company data',
        details: error.message,
        responseData: error.response.data
      });
    }
    res.status(500).json({
      error: 'Failed to fetch company data',
      details: error.message
    });
  }
});

// Function to calculate technical indicators
function calculateTechnicalIndicators(candlestickData) {
  const indicators = {};

  // Example of Moving Average Calculation
  const movingAverage = (data, period) => {
    return data.map((_, idx, arr) => {
      if (idx < period - 1) return null;
      const subset = arr.slice(idx - period + 1, idx + 1);
      const avg = subset.reduce((sum, d) => sum + d.close, 0) / period;
      return { date: data[idx].date, movingAverage: avg };
    }).filter(d => d);
  };

  indicators['50-dayMA'] = movingAverage(candlestickData, 50);
  indicators['200-dayMA'] = movingAverage(candlestickData, 200);

  // Add other indicators like RSI, MACD as needed
  // Example: RSI calculation (you need to implement RSI logic)
  
  return indicators;
}

// Function to analyze sentiment
function analyzeSentiment(newsData) {
  // Example sentiment analysis (needs real sentiment analysis implementation)
  const sentimentScores = newsData['News Sentiment'] || [];
  const positive = sentimentScores.filter(score => score.sentiment === 'positive').length;
  const negative = sentimentScores.filter(score => score.sentiment === 'negative').length;

  return {
    positiveNews: positive,
    negativeNews: negative,
    sentimentRatio: positive / (positive + negative)
  };
}

module.exports = router;
