
import { callGeminiChat } from './config';

export const generateImage = async (prompt: string) => {
  try {
    console.log("Generating image description for prompt:", prompt);
    
    const messages = [
      { role: "system", content: "You are an AI that can describe images in great detail based on text prompts." },
      { role: "user", content: `Please generate a detailed description of an image based on the following prompt: ${prompt}. Describe what would be in the image, including visual details, composition, style, colors, and mood.` }
    ];

    const result = await callGeminiChat(messages);
    console.log("Received image description response");
    return result;
  } catch (error) {
    console.error("Error generating image description:", error);
    throw error;
  }
};
