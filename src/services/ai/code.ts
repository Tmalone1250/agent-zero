
import { createGeminiClient, DEFAULT_MODEL_CONFIG } from './config';

export const generateCodeAssistantResponse = async (prompt: string) => {
  try {
    console.log("Generating code assistant response for:", prompt);
    const genAI = await createGeminiClient();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.0-pro",
      generationConfig: DEFAULT_MODEL_CONFIG
    });

    const result = await model.generateContent(`
      As a coding assistant, please help with the following request:
      
      ${prompt}
      
      Please provide:
      1. Code solution
      2. Explanation of the solution
      3. Any relevant best practices or considerations
      4. Example usage if applicable
      
      Format the response with clear code blocks and explanations.
    `);
    const response = await result.response;
    const text = response.text();
    console.log("Received code assistant response:", text);
    return text;
  } catch (error) {
    console.error("Error generating code assistant response:", error);
    throw error;
  }
};
