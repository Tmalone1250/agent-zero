
import { callOpenRouter } from './config';

export const generateMarketAnalysis = async (prompt: string) => {
  try {
    console.log("Generating market analysis for:", prompt);
    
    const messages = [
      { role: "system", content: "You are a market analyst who provides comprehensive insights on market trends, competitors, and strategic opportunities." },
      { role: "user", content: `As a market analyst, please analyze the following request:
      
      ${prompt}
      
      Please provide:
      1. Market Overview
      2. Key Trends
      3. Competitor Analysis
      4. Growth Opportunities
      5. Risk Assessment
      6. Strategic Recommendations
      
      Format the response in clear sections with detailed insights.` }
    ];

    const result = await callOpenRouter(messages);
    console.log("Received market analysis response");
    return result;
  } catch (error) {
    console.error("Error generating market analysis:", error);
    throw error;
  }
};
