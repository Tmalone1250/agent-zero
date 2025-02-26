
import { createGeminiClient, DEFAULT_MODEL_CONFIG } from './config';

export const generateImage = async (prompt: string) => {
  try {
    console.log("Generating image for prompt:", prompt);
    const genAI = await createGeminiClient();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.0-pro",
      generationConfig: DEFAULT_MODEL_CONFIG
    });

    const result = await model.generateContent(`
      Please generate an image based on the following description:
      
      ${prompt}
      
      Please provide a detailed description of the generated image and any relevant metadata.
    `);
    const response = await result.response;
    const text = response.text();
    console.log("Received image generation response:", text);
    return text;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
