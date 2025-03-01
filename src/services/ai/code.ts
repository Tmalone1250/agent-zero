
import { callOpenRouter } from './config';

export const generateCodeAssistantResponse = async (prompt: string) => {
  try {
    console.log("Generating code assistant response for:", prompt);
    
    const messages = [
      { role: "system", content: "You are a coding assistant who helps with programming questions and provides clean, efficient code solutions with explanations." },
      { role: "user", content: `As a coding assistant, please help with the following request:
      
      ${prompt}
      
      Please provide:
      1. Code solution
      2. Explanation of the solution
      3. Any relevant best practices or considerations
      4. Example usage if applicable
      
      Format the response with clear code blocks and explanations.` }
    ];

    const result = await callOpenRouter(messages);
    console.log("Received code assistant response");
    return result;
  } catch (error) {
    console.error("Error generating code assistant response:", error);
    throw error;
  }
};
