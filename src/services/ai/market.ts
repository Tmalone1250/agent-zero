
import { createGeminiClient, DEFAULT_MODEL_CONFIG } from './config';

export const generateMarketAnalysis = async (prompt: string) => {
  try {
    console.log("Generating market analysis for:", prompt);
    const genAI = await createGeminiClient();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.0-pro",
      generationConfig: DEFAULT_MODEL_CONFIG
    });

    const result = await model.generateContent(`
      As a market analyst, please analyze the following request:
      
      ${prompt}
      
      Please provide:
      1. Market Overview
      2. Key Trends
      3. Competitor Analysis
      4. Growth Opportunities
      5. Risk Assessment
      6. Strategic Recommendations
      
      Format the response in clear sections with detailed insights.
    `);
    const response = await result.response;
    const text = response.text();
    console.log("Received market analysis response:", text);
    return text;
  } catch (error) {
    console.error("Error generating market analysis:", error);
    throw error;
  }
};
