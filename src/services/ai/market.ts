
import { callGeminiAPI } from './config';

export const generateMarketAnalysis = async (prompt: string) => {
  try {
    console.log("Generating market analysis for prompt:", prompt);
    
    const fullPrompt = `
      I need a comprehensive market analysis based on the following request:
      
      ${prompt}
      
      Please provide a structured analysis including:
      
      1. Market overview and current trends
      2. Key players and their market shares
      3. Growth opportunities and challenges
      4. Competitive landscape
      5. Future outlook and predictions
      
      Format your response in a clear, structured way with headings and bullet points where appropriate.
    `;
    
    const result = await callGeminiAPI(fullPrompt);
    console.log("Received market analysis response");
    return result;
  } catch (error) {
    console.error("Error generating market analysis:", error);
    throw error;
  }
};
