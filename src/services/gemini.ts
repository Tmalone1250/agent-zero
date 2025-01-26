import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

const getGeminiApiKey = async () => {
  console.log("Fetching Gemini API key from Supabase...");
  try {
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'GEMINI_API_KEY' }
    });
    
    console.log("Supabase function response:", { data, error });
    
    if (error) {
      console.error("Error from Supabase function:", error);
      throw new Error(`Failed to get Gemini API key: ${error.message}`);
    }
    
    if (!data?.GEMINI_API_KEY) {
      console.error("No API key returned from function");
      throw new Error("GEMINI_API_KEY not found in response");
    }
    
    return data.GEMINI_API_KEY;
  } catch (error) {
    console.error("Error in getGeminiApiKey:", error);
    throw error;
  }
};

export const generateCodeAssistantResponse = async (prompt: string) => {
  try {
    console.log("Generating code assistant response for prompt:", prompt);
    const apiKey = await getGeminiApiKey();
    console.log("Successfully retrieved API key");
    
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
    console.log("Successfully retrieved API key");
    
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

export const generateContent = async (prompt: string) => {
  try {
    console.log("Generating content for prompt:", prompt);
    const apiKey = await getGeminiApiKey();
    console.log("Successfully retrieved API key");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent([
      {
        role: "user",
        parts: [{ text: `Please write content based on this prompt: ${prompt}` }],
      },
    ]);
    const response = await result.response;
    const text = response.text();
    console.log("Received content generation response:", text);
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};