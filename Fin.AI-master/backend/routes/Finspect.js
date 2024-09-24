const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/analyze', async (req, res) => {
  const { company } = req.body;

  if (!company) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  try {
    console.log(`Attempting to analyze company: ${company}`);
    console.log(`Using Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Key is set' : 'Key is missing'}`);

    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: `Provide a fundamental analysis for ${company} following this structure: Introduction, Global and National Economic Analysis, Industry Analysis, Company Analysis, Comparative Analysis, Valuation, Risk Assessment, Conclusion, Monitoring and Review.`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: process.env.GEMINI_API_KEY
        }
      }
    );

    console.log('Gemini API response received');
    const analysis = geminiResponse.data.candidates[0].content.parts[0].text;
    res.json({ analysis });
  } catch (error) {
    console.error('Detailed error:', error);

    if (error.response) {
      console.error('Gemini API responded with error:', error.response.data);
      console.error('Status code:', error.response.status);
      res.status(error.response.status).json({ error: 'Error from Gemini API', details: error.response.data });
    } else if (error.request) {
      console.error('No response received from Gemini API');
      res.status(500).json({ error: 'No response from Gemini API' });
    } else {
      console.error('Error setting up the request:', error.message);
      res.status(500).json({ error: 'Error setting up the request to Gemini API' });
    }
  }
});

module.exports = router;