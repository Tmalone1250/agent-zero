
import { createGeminiClient, DEFAULT_MODEL_CONFIG } from './config';

export const generateLeads = async (prompt: string) => {
  try {
    console.log("Generating leads for prompt:", prompt);
    const genAI = await createGeminiClient();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.0-pro",
      generationConfig: DEFAULT_MODEL_CONFIG
    });

    const result = await model.generateContent(`
      As a lead generation expert, please analyze the following request and generate potential business leads:
      
      ${prompt}
      
      Please provide a structured response with:
      1. Target Market Analysis
      2. Ideal Customer Profile
      3. List of Potential Leads (with company names, contact roles)
      4. Outreach Strategy
      5. Follow-up Recommendations
      
      Format the response in clear sections with actionable insights.
    `);
    const response = await result.response;
    const text = response.text();
    console.log("Received lead generation response:", text);
    return text;
  } catch (error) {
    console.error("Error generating leads:", error);
    throw error;
  }
};
