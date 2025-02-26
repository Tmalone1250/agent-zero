
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

export const getGeminiApiKey = async () => {
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

export const createGeminiClient = async () => {
  const apiKey = await getGeminiApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const DEFAULT_MODEL_CONFIG = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
};

