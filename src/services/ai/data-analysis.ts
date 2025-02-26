
import { createGeminiClient, DEFAULT_MODEL_CONFIG } from './config';

export const generateDataAnalysis = async (data: string) => {
  try {
    console.log("Generating data analysis for:", data);
    const genAI = await createGeminiClient();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.0-pro",
      generationConfig: DEFAULT_MODEL_CONFIG
    });

    const result = await model.generateContent(`
      As a data analyst, please analyze the following data and provide insights:
      
      ${data}
      
      Please provide:
      1. Summary Statistics
      2. Key Trends and Patterns
      3. Notable Correlations
      4. Recommendations based on the analysis
      
      Format the response in clear sections with detailed insights.
    `);
    const response = await result.response;
    const text = response.text();
    console.log("Received data analysis response:", text);
    return text;
  } catch (error) {
    console.error("Error generating data analysis:", error);
    throw error;
  }
};
