import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateCodeAssistantResponse = async (prompt: string) => {
  try {
    console.log("Generating code assistant response for prompt:", prompt);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Received code assistant response:", text);
    return text;
  } catch (error) {
    console.error("Error generating code assistant response:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string) => {
  try {
    console.log("Generating image for prompt:", prompt);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Received image generation response:", text);
    return text;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};