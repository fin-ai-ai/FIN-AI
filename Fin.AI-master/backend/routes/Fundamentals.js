const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeCompanyData(companyCode) {
  const url = `https://www.screener.in/company/${companyCode}/consolidated/`;
  
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const companyData = {};
    
    // Extract company name
    companyData.name = $('h1').text().trim();
    if (!companyData.name) {
      console.log('Failed to extract company name');
    }
    
    // Extract ratios
    const ratios = $('.company-ratios #top-ratios li');
    if (ratios.length === 0) {
      console.log('No ratios found');
    }
    
    ratios.each((index, element) => {
      const name = $(element).find('.name').text().trim();
      let value = $(element).find('.value').text().trim();
      
      if (!name || !value) {
        console.log(`Failed to extract ratio at index ${index}`);
        return; // Skip this iteration
      }
      
      value = value.replace('₹', '').replace(',', '').trim();
      
      if (name === "High / Low") {
        const [high, low] = value.split('/');
        companyData["52 Week High"] = parseFloat(high.trim());
        companyData["52 Week Low"] = parseFloat(low.trim());
      } else if (value.includes('%')) {
        companyData[name] = parseFloat(value.replace('%', ''));
      } else if (value.includes('Cr.')) {
        companyData[name] = parseFloat(value.replace('Cr.', '')) * 10000000;
      } else {
        companyData[name] = isNaN(parseFloat(value)) ? value : parseFloat(value);
      }
    });
    
    // Extract about section
    companyData.about = $('.about-section').text().trim();
    if (!companyData.about) {
      console.log('Failed to extract about section');
    }
    
    if (Object.keys(companyData).length === 0) {
      throw new Error('No data could be extracted from the page');
    }
    
    return companyData;
  } catch (error) {
    console.error('Error scraping company data:', error);
    throw error; // Re-throw the error to be caught in the route handler
  }
}

router.get('/search', async (req, res) => {
  try {
    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ error: 'Ticker symbol is required' });
    }

    const companyData = await scrapeCompanyData(ticker);

    if (!companyData || Object.keys(companyData).length === 0) {
      return res.status(404).json({ error: 'Failed to retrieve company data' });
    }

    res.json(companyData);
  } catch (error) {
    console.error('Error in /search route:', error);
    res.status(500).json({
      error: 'Failed to fetch company data',
      details: error.message
    });
  }
});

// Add a new route to fetch stock data
router.get('/stocks', async (req, res) => {
  try {
    // Here you would typically fetch the stock data from your database or another API
    // For this example, we'll return a mock data array
    const mockStockData = [
      { 'S.No': '1', 'Name': 'HDFC Bank', 'CMP': '1500', 'P/E': '20', 'Mar Cap': '800000', 'Div Yld': '1.2' },
      { 'S.No': '2', 'Name': 'Reliance Industries', 'CMP': '2000', 'P/E': '25', 'Mar Cap': '1200000', 'Div Yld': '0.8' },
      // Add more mock data as needed
    ];

    res.json(mockStockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({
      error: 'Failed to fetch stock data',
      details: error.message
    });
  }
});

module.exports = router;