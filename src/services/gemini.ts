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
    const result = await model.generateContent(`Please write content based on this prompt: ${prompt}`);
    const response = await result.response;
    const text = response.text();
    console.log("Received content generation response:", text);
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

export const generateDataAnalysis = async (data: string) => {
  try {
    console.log("Analyzing data:", data);
    const apiKey = await getGeminiApiKey();
    console.log("Successfully retrieved API key");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`
      Please analyze this data and provide insights:
      ${data}
      
      Please provide:
      1. Summary of the data
      2. Key patterns or trends
      3. Notable insights
      4. Recommendations based on the analysis
    `);
    const response = await result.response;
    const text = response.text();
    console.log("Received data analysis response:", text);
    return text;
  } catch (error) {
    console.error("Error analyzing data:", error);
    throw error;
  }
};

export const generateSeoOptimization = async (content: string) => {
  try {
    console.log("Generating SEO optimization for content:", content);
    const apiKey = await getGeminiApiKey();
    console.log("Successfully retrieved API key");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`
      As an SEO expert, please analyze the following URL or content and provide a detailed report:

      ${content}
      
      Please include:
      1. Overall SEO grade (A+, A, B, etc.)
      2. Detailed analysis of:
         - Meta tags and descriptions
         - Keyword optimization
         - Content quality
         - Technical SEO factors
         - Loading speed considerations
         - Mobile responsiveness
      3. Specific recommendations for improvement
      4. Priority levels for each recommendation
    `);
    const response = await result.response;
    const text = response.text();
    console.log("Received SEO optimization response:", text);
    return text;
  } catch (error) {
    console.error("Error generating SEO optimization:", error);
    throw error;
  }
};

export const generateCustomerServiceResponse = async (message: string) => {
  try {
    console.log("Generating customer service response for message:", message);
    const apiKey = await getGeminiApiKey();
    console.log("Successfully retrieved API key");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(`
      You are a helpful and friendly customer service representative. 
      Please respond to the following customer message in a professional and helpful manner:
      ${message}
      
      Remember to:
      1. Be polite and empathetic
      2. Provide clear and concise information
      3. Offer specific solutions when possible
      4. Ask clarifying questions if needed
    `);
    
    const response = await result.response;
    const text = response.text();
    console.log("Received customer service response:", text);
    return text;
  } catch (error) {
    console.error("Error generating customer service response:", error);
    throw error;
  }
};

export const generateMarketAnalysis = async (prompt: string) => {
  try {
    console.log("Generating market analysis for prompt:", prompt);
    const apiKey = await getGeminiApiKey();
    console.log("Successfully retrieved API key");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`
      As a market analysis expert, please analyze the following request and provide detailed insights in a structured format:
      
      ${prompt}
      
      Please provide your response in the following JSON format:
      {
        "summary": "Brief overview of the analysis",
        "marketSize": {
          "current": "Current market size in billions",
          "projected": "Projected market size in billions",
          "growthRate": "Annual growth rate percentage"
        },
        "keyTrends": ["trend1", "trend2", "trend3"],
        "competitorData": [
          {"name": "Competitor 1", "marketShare": 25},
          {"name": "Competitor 2", "marketShare": 20}
        ],
        "monthlyGrowth": [
          {"month": "Jan", "growth": 10},
          {"month": "Feb", "growth": 15}
        ],
        "recommendations": ["rec1", "rec2", "rec3"]
      }
    `);
    const response = await result.response;
    const text = response.text();
    console.log("Received market analysis response:", text);
    
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      return {
        summary: text,
        marketSize: { current: 0, projected: 0, growthRate: 0 },
        keyTrends: [],
        competitorData: [],
        monthlyGrowth: [],
        recommendations: []
      };
    }
  } catch (error) {
    console.error("Error generating market analysis:", error);
    throw error;
  }
};
