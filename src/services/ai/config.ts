
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

export const getOpenRouterApiKey = async () => {
  console.log("Fetching OpenRouter API key from Supabase...");
  try {
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'OPENROUTER_API_KEY' }
    });
    
    console.log("Supabase function response for OpenRouter:", { data, error });
    
    if (error) {
      console.error("Error from Supabase function:", error);
      throw new Error(`Failed to get OpenRouter API key: ${error.message}`);
    }
    
    if (!data?.OPENROUTER_API_KEY) {
      console.error("No OpenRouter API key returned from function");
      throw new Error("OPENROUTER_API_KEY not found in response");
    }
    
    return data.OPENROUTER_API_KEY;
  } catch (error) {
    console.error("Error in getOpenRouterApiKey:", error);
    throw error;
  }
};

export const createGeminiClient = async () => {
  const apiKey = await getGeminiApiKey();
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const DEFAULT_MODEL_CONFIG = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
};

export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const OPENROUTER_MODEL = "deepseek/deepseek-chat";

export const callOpenRouter = async (messages: any[], temperature: number = 0.7) => {
  try {
    const apiKey = await getOpenRouterApiKey();
    
    console.log("Calling OpenRouter with API key:", apiKey ? "Key exists" : "No key found");
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin, // Required by OpenRouter
        "X-Title": "AI Assistant App" // Optional, but helpful for OpenRouter to track your app
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages,
        temperature,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error response:", errorText);
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    throw error;
  }
};
