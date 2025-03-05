
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
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const DEFAULT_MODEL_CONFIG = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
};

export const callGeminiAPI = async (prompt: string, temperature: number = 0.7) => {
  try {
    console.log("Calling Gemini API with prompt:", prompt.substring(0, 100) + "...");
    
    const genAI = await createGeminiClient();
    // Update to use gemini-1.5-pro model instead of gemini-pro
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature,
        topP: DEFAULT_MODEL_CONFIG.topP,
        topK: DEFAULT_MODEL_CONFIG.topK,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("Received Gemini API response");
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

// Helper function to convert chat messages to Gemini format
export const callGeminiChat = async (messages: Array<{role: string, content: string}>, temperature: number = 0.7) => {
  try {
    console.log("Calling Gemini Chat API with messages");
    
    const genAI = await createGeminiClient();
    // Update to use gemini-1.5-pro model instead of gemini-pro
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature,
        topP: DEFAULT_MODEL_CONFIG.topP,
        topK: DEFAULT_MODEL_CONFIG.topK,
      },
    });

    // Convert messages to Gemini chat format
    const geminiMessages = messages.map(msg => {
      // Map 'user' and 'assistant' roles to Gemini's expected format
      const role = msg.role === 'assistant' ? 'model' : 'user';
      return {
        role,
        parts: [{ text: msg.content }]
      };
    });

    // Start a chat session
    const chat = model.startChat({
      history: geminiMessages.slice(0, -1),
      generationConfig: {
        temperature,
        topP: DEFAULT_MODEL_CONFIG.topP,
        topK: DEFAULT_MODEL_CONFIG.topK,
      },
    });

    // Get the last message to send
    const lastMessage = geminiMessages[geminiMessages.length - 1];
    
    // Send the message and get the response
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const text = result.response.text();
    
    console.log("Received Gemini Chat API response");
    return text;
  } catch (error) {
    console.error("Error calling Gemini Chat API:", error);
    throw error;
  }
};
