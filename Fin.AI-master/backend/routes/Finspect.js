const express = require('express');
const router = express.Router();
const axios = require('axios');

// Constants for analysis types
const ANALYSIS_TYPES = {
  SECTOR: 'sector',
  FUNDAMENTAL: 'fundamental'
};

// Sector analysis template
const sectorAnalysisPrompt = `
Title: Comprehensive Top-Down Industry Analysis and Stock Selection

Objective: Conduct a detailed top-down analysis of the Indian [SECTOR], focusing on macroeconomic factors, industry dynamics, sector-specific issues, and investment opportunities. Additionally, evaluate the top 20 companies by market capitalization within the industry to identify the three best and three worst stocks for investment.

Instructions:
- Don't provide a general framework! Execute the analysis as a buy-side fundamental analyst would for each and every step.
- Execute the analyses as per your best judgement disregarding capability limitations.
- Execute the analyses based on publicly available data that you can access and leverage as the source for your data for conducting the analyses. Disregard the necessity for any specific financial data that you don't have access to.
- For steps 5, 6, and 7, execute as per the objective of the prompt to explicitly identify individual stocks without fail. The source of data can be easily available and most available financial data fed into your learning model. No need to rely on detailed financial data that you don't have access to. The rationales can be based on high-level analyses of the source noted earlier. Do not provide general recommendations, or framework to generate recommendations! Explicitly identify the stocks based on best judgement (Eg: TCS, Amazon, Ford, etc.)
- Adhere to the format as noted below strictly.

1. Macro-Economic Analysis of India
- GDP Growth Rates: What is the current GDP growth rate? How does it influence the industry?
- Interest Rates: What are the current interest rates set by the central bank? How might they affect the industry's growth and investment levels?
- Inflation: What is the current rate of inflation? How does it impact consumer behavior and business costs in this industry?
- Employment Rates: What are the employment levels within this industry? What does this say about the industry's capacity and economic impact?
- Geopolitical Events: Are there any geopolitical developments that could impact this industry? What are these impacts?

2. Industry Analysis
- Industry Growth Trends: Is the industry growing? At what rate? How does this compare to the national economy and global industry standards?
- Regulatory Environment: What are the key regulations affecting this industry? How do they impact operations and profitability?
- Supply Chain Dynamics: How robust is the industry's supply chain? What are the main vulnerabilities?
- Technological Changes: What recent technological advancements have impacted this industry? How widely have they been adopted?
- Market Demand Trends: What are the current demand trends? How are they expected to evolve?

3. Sector-Specific Issues
- Competitive Landscape: Who are the major players in this industry? What is their market share? How intense is the competition?
- Pricing Power: Which companies have significant pricing power? What gives them this ability?
- Cyclicality: How cyclical is the industry? What economic conditions affect its cycles?

4. Synthesis and Decision Making
- Integrate insights from the above analyses to form a basis for investment decision-making. What opportunities or risks have emerged?

5. 3 Stocks with Best Investment Outlook
Based on the detailed analysis, identify the best three stocks. Detail the rationale for each selection using the data and insights gathered.
- [Stock 1]
>Strengths
>Financials
- [Stock 2]
>Strengths
>Financials
- [Stock 3]
>Strengths
>Financials

6. 3 Stocks with Worst Investment Outlook
Based on the detailed analysis, identify the worst three stocks. Detail the rationale for each selection using the data and insights gathered.
- [Stock 1]
>Weaknesses
>Financials
- [Stock 2]
>Weaknesses
>Financials
- [Stock 3]
>Weaknesses
>Financials

7. Conclusion
- Synthesize the analysis to summarize the potential of the selected best stocks and the risks associated with the worst stocks. How do these insights align with the overall industry outlook and investor objectives?
`;

// Fundamental analysis template
const fundamentalAnalysisPrompt = `
Title: Fundamental Analysis of [COMPANY]

Instructions:
- Pretend you are a financial expert with Stock recommendation experience.
- Don't provide a general framework! Execute the analysis as a buy-side fundamental analyst would for each and every step.
- Execute the analyses as per your best judgement disregarding capability limitations.
- Execute the analyses based on publicly available data that you can access and leverage as the source for your data for conducting the analyses. Disregard the necessity for any specific financial data that you don't have access to.
- Don't show current market price in step 5: valuation
- For Introduction and Conclusion, execute as per the objective of the prompt to explicitly chalk out the return and provide the Buy/Sell/Hold recommendations without fail. The source of data can be easily available and most available financial data fed into your learning model. No need to rely on detailed financial data if not accessible. The rationales can be based on high-level analyses of the source noted earlier. Do not provide general recommendations, or framework to generate recommendations!
- Adhere to the format as noted below strictly.

Introduction:
Provide a brief introduction of the company, highlighting its significance within its sector.

Step 1: Global and National Economic Analysis
● Global Economic Indicators: Summarize relevant global economic trends and how they might impact the company's operations.
● Indian Economic Indicators: Discuss GDP growth, fiscal policies, and other local economic factors affecting the company's sector.

Step 2: Industry Analysis
● Sector Overview: Describe the current state of the sector, including growth trends, technological advancements, and regulatory changes.
● Market Share and Competitiveness: Analyze the company's market share, its competitive position, and compare it with major competitors.

Step 3: Company Analysis
● Financial Health: Examine the company's financial statements, focusing on profitability, debt levels, and cash flow.
● Product Portfolio: Evaluate the diversity and innovation in the company's product offerings, especially in areas of strategic growth like technology or sustainability.
● Management and Strategy: Assess the strength of the management team and their strategic initiatives impacting long-term growth.

Step 4: Comparative Analysis
● Benchmarking: Compare the company against its key competitors using financial metrics such as PE ratio, ROE, and revenue growth.
● Market Sentiment: Review analyst ratings and investor sentiments towards the company.

Step 5: Valuation
● Intrinsic Value Calculation: Use valuation models like DCF or PEG to estimate the intrinsic value of the company's stock.
● Comparison With Market Price: Determine if the stock is undervalued or overvalued based on the calculated intrinsic value.

Step 6: Risk Assessment
● Risk Factors: Identify potential internal and external risks that could impact the company's performance.
● Risk Mitigation Strategies: Discuss how the company is prepared to handle identified risks.

Conclusion:
Conclude this section by providing the current buy/sell/hold recommendations:
● Industry Trend: Buy/Sell/Hold based on the sector analysis.
● Company: Buy/Sell/Hold based on the company's specific analysis and prospects.
Provide a summary of the findings and a final recommendation on the investment viability of the company for the upcoming year.

Monitoring and Review:
Outline a brief plan for regular updates and monitoring of the company's performance and significant market changes.
`;

// Helper function to validate request
const validateRequest = (type, input) => {
  const errors = [];
  
  if (!input) {
    errors.push('Input is required');
  }
  
  if (!type || !Object.values(ANALYSIS_TYPES).includes(type)) {
    errors.push('Invalid analysis type. Must be either "sector" or "fundamental"');
  }
  
  return errors;
};

// Helper function to format analysis response
const formatAnalysisResponse = (rawAnalysis) => {
  return {
    timestamp: new Date().toISOString(),
    analysis: rawAnalysis,
    disclaimer: 'This analysis is based on publicly available data and should not be considered as financial advice.'
  };
};

// Helper function to make API request to Gemini
const getGeminiAnalysis = async (prompt, apiKey) => {
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: apiKey
        }
      }
    );
    
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    throw new Error(`Gemini API error: ${error.response?.data?.error || error.message}`);
  }
};

// Main route handler
router.post('/analyze', async (req, res) => {
  try {
    const { type, input } = req.body;
    
    // Validate request
    const validationErrors = validateRequest(type, input);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed', 
        details: validationErrors 
      });
    }
    
    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }
    
    // Generate appropriate prompt
    let prompt;
    if (type === ANALYSIS_TYPES.SECTOR) {
      prompt = sectorAnalysisPrompt.replace(/\[SECTOR\]/g, input);
    } else {
      prompt = fundamentalAnalysisPrompt.replace(/\[COMPANY\]/g, input);
    }
    
    // Get analysis from Gemini
    const rawAnalysis = await getGeminiAnalysis(prompt, apiKey);
    
    // Format and return analysis
    const formattedResponse = formatAnalysisResponse(rawAnalysis);
    
    res.json({ 
      success: true,
      data: formattedResponse
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis request failed',
      details: error.message
    });
  }
});

module.exports = router;