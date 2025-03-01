
import { callOpenRouter } from './config';

export const generateCustomerServiceResponse = async (message: string) => {
  try {
    console.log("Generating customer service response for message:", message);
    
    const messages = [
      { role: "system", content: "You are a helpful and friendly customer service representative. Be polite, empathetic, provide clear information, offer specific solutions when possible, and ask clarifying questions if needed." },
      { role: "user", content: message }
    ];
    
    const result = await callOpenRouter(messages);
    console.log("Received customer service response");
    return result;
  } catch (error) {
    console.error("Error generating customer service response:", error);
    throw error;
  }
};
