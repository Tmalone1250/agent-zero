
import { callGeminiChat } from './config';

export const generateDataAnalysis = async (data: string) => {
  try {
    console.log("Generating data analysis for:", data);
    
    const messages = [
      { role: "system", content: "You are a data analyst who can analyze and interpret data to provide meaningful insights." },
      { role: "user", content: `As a data analyst, please analyze the following data and provide insights:
      
      ${data}
      
      Please provide:
      1. Summary Statistics
      2. Key Trends and Patterns
      3. Notable Correlations
      4. Recommendations based on the analysis
      
      Format the response in clear sections with detailed insights.` }
    ];

    const result = await callGeminiChat(messages);
    console.log("Received data analysis response");
    return result;
  } catch (error) {
    console.error("Error generating data analysis:", error);
    throw error;
  }
};
