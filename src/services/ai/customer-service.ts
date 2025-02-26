
import { createGeminiClient, DEFAULT_MODEL_CONFIG } from './config';

export const generateCustomerServiceResponse = async (message: string) => {
  try {
    console.log("Generating customer service response for message:", message);
    const genAI = await createGeminiClient();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.0-pro",
      generationConfig: DEFAULT_MODEL_CONFIG
    });
    
    const result = await model.generateContent(`
      You are a helpful and friendly customer service representative. 
      Please respond to the following customer message in a professional and helpful manner:
      ${message}
      
      Remember to:
      1. Be polite and empathetic
      2. Provide clear and concise information
      3. Offer specific solutions when possible
      4. Ask clarifying questions if needed
    `);
    
    const response = await result.response;
    const text = response.text();
    console.log("Received customer service response:", text);
    return text;
  } catch (error) {
    console.error("Error generating customer service response:", error);
    throw error;
  }
};
