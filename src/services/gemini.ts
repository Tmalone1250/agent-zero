import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

const getGeminiApiKey = async () => {
  const { data: { GEMINI_API_KEY }, error } = await supabase.functions.invoke('get-secret', {
    body: { secretName: 'GEMINI_API_KEY' }
  });
  
  if (error || !GEMINI_API_KEY) {
    console.error("Error fetching Gemini API key:", error);
    throw new Error("Failed to get Gemini API key");
  }
  
  return GEMINI_API_KEY;
};

export const generateCodeAssistantResponse = async (prompt: string) => {
  try {
    console.log("Generating code assistant response for prompt:", prompt);
    const apiKey = await getGeminiApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
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
    const apiKey = await getGeminiApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
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