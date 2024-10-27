const express = require('express');
const router = express.Router();
const axios = require('axios');

// Constants for analysis types
const ANALYSIS_TYPE = 'personal_finance';

// Personal finance planning template
const personalFinancePlanningPrompt = `
Title: Comprehensive Personal Financial Planning and Management

Instructions:
- Pretend you are a certified financial planner with extensive experience in personal finance management.
- Don't provide a general framework! Execute the analysis as a professional financial advisor would for each step.
- Execute the analyses as per your best judgment, disregarding capability limitations.
- Base your advice on publicly available financial planning principles and best practices.
- Adhere to the format noted below strictly.
- Tailor your advice based on the user's responses to the initial questions.
-very detailed analysis result with proper explanation

User Information:
[USER_INFO]

Financial Planning Model:

Introduction:
Provide a brief overview of the importance of personal financial planning and how it can help achieve the user's financial goals.

Income and Expense Analysis
● Income Breakdown: Analyze the user's income sources and stability.
● Expense Categorization: Categorize and analyze the user's expenses, identifying areas for potential savings.
● Debt-to-Income Ratio: Calculate and interpret the user's debt-to-income ratio.

Debt Management Strategy
● Debt Prioritization: Rank outstanding debts based on interest rates and balances.
● Repayment Plan: Develop a structured plan for debt repayment, possibly including debt consolidation options.
● Interest Savings: Calculate potential interest savings from accelerated debt repayment.

Emergency Fund Planning
● Fund Size Calculation: Determine the appropriate size of the emergency fund based on the user's circumstances.
● Funding Strategy: Develop a plan to build or maintain the emergency fund.
● Fund Placement: Recommend suitable savings vehicles for the emergency fund.

Retirement Planning
● Retirement Needs Analysis: Estimate the user's retirement income needs based on current lifestyle and future goals.
● Savings Rate Calculation: Determine the necessary savings rate to meet retirement goals.
● Investment Strategy: Recommend an asset allocation strategy aligned with the user's risk tolerance and time horizon.

Short-term and Long-term Goal Planning
● Goal Prioritization: Rank the user's financial goals based on importance and timeline.
● Savings Targets: Calculate required savings for each goal.
● Investment Vehicles: Suggest appropriate investment or savings vehicles for each goal.

Tax Optimization
● Tax-Advantaged Accounts: Recommend utilization of tax-advantaged accounts (e.g., 401(k), IRAs) where applicable.
● Tax Deduction Opportunities: Identify potential tax deductions or credits the user may be eligible for.
● Tax-Efficient Investing: Suggest tax-efficient investment strategies if applicable.

Insurance and Risk Management
● Coverage Analysis: Evaluate the adequacy of current insurance coverage.
● Gap Identification: Identify any gaps in insurance coverage based on the user's life situation.
● Recommendations: Suggest additional or modified insurance coverage as needed.

Estate Planning Basics
● Will and Trust: Discuss the importance of having a will and potentially setting up trusts.
● Beneficiary Designations: Emphasize the importance of keeping beneficiary designations up to date.
● Power of Attorney: Explain the significance of having financial and healthcare powers of attorney.

Investment Strategy
● Asset Allocation: Recommend an appropriate asset allocation based on the user's risk tolerance and goals.
● Diversification: Explain the importance of diversification and suggest ways to achieve it.
● Rebalancing Strategy: Outline a plan for regular portfolio rebalancing.

Financial Education and Monitoring
● Financial Literacy: Suggest resources for ongoing financial education.
● Regular Review Schedule: Establish a schedule for reviewing and adjusting the financial plan.
● Milestone Tracking: Set up a system for tracking progress towards financial goals.

Conclusion:
Summarize the key aspects of the personalized financial plan, highlighting the most critical actions the user should take immediately. Emphasize the importance of discipline and consistency in following the plan.

Implementation and Review:
Outline a step-by-step implementation plan for the user, including immediate actions, short-term goals, and long-term strategies. Recommend a schedule for regular reviews and updates to the financial plan based on life changes or significant economic events.
`;

// Helper function to validate request
const validateRequest = (userInfo) => {
  const requiredFields = [
    'age', 'retirementAge', 'annualIncome', 'jobStability',
    'majorExpenses', 'outstandingDebts', 'shortTermGoals',
    'longTermGoals', 'savingsAndInvestments', 'riskTolerance',
    'dependents', 'insuranceCoverage', 'expectedLifeChanges'
  ];
  
  const errors = [];
  
  for (const field of requiredFields) {
    if (!userInfo[field] && userInfo[field] !== 0) {
      errors.push(`${field} is required`);
    }
  }
  
  return errors;
};

// Helper function to format analysis response
const formatAnalysisResponse = (rawAnalysis) => {
  return {
    timestamp: new Date().toISOString(),
    analysis: rawAnalysis,
    disclaimer: 'This financial plan is based on the information provided and should not be considered as professional financial advice. Please consult with a certified financial planner for personalized advice.'
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
router.post('/plan', async (req, res) => {
  try {
    const userInfo = req.body;
    
    // Validate request
    const validationErrors = validateRequest(userInfo);
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
    
    // Generate prompt with user info
    const userInfoString = Object.entries(userInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    const prompt = personalFinancePlanningPrompt.replace('[USER_INFO]', userInfoString);
    
    // Get analysis from Gemini
    const rawAnalysis = await getGeminiAnalysis(prompt, apiKey);
    
    // Format and return analysis
    const formattedResponse = formatAnalysisResponse(rawAnalysis);
    
    res.json({ 
      success: true,
      data: formattedResponse
    });
    
  } catch (error) {
    console.error('Personal finance planning error:', error);
    res.status(500).json({
      success: false,
      error: 'Personal finance planning request failed',
      details: error.message
    });
  }
});

module.exports = router;