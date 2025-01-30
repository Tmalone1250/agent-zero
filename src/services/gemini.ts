import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";
import { parseDocument } from "@/utils/documentParser";

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

export const generateResearch = async (topic: string) => {
  try {
    console.log("Generating research for topic:", topic);
    const apiKey = await getGeminiApiKey();
    console.log("Successfully retrieved API key");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`
      As a research assistant, please analyze the following topic and provide a comprehensive research analysis:
      
      ${topic}
      
      Please provide:
      1. Executive Summary
      2. Background Information
      3. Key Findings
      4. Analysis and Discussion
      5. Conclusions and Recommendations
      6. References and Further Reading
      
      Format the response in clear sections with detailed insights.
    `);
    const response = await result.response;
    const text = response.text();
    console.log("Received research analysis response:", text);
    return text;
  } catch (error) {
    console.error("Error generating research:", error);
    throw error;
  }
};

export const generateLeads = async (prompt: string) => {
  try {
    console.log("Generating leads for prompt:", prompt);
    const apiKey = await getGeminiApiKey();
    console.log("Successfully retrieved API key");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`
      As a lead generation expert, please analyze the following request and generate potential business leads:
      
      ${prompt}
      
      Please provide a structured response with:
      1. Target Market Analysis
      2. Ideal Customer Profile
      3. List of Potential Leads (with company names, contact roles)
      4. Outreach Strategy
      5. Follow-up Recommendations
      
      Format the response in clear sections with actionable insights.
    `);
    const response = await result.response;
    const text = response.text();
    console.log("Received lead generation response:", text);
    return text;
  } catch (error) {
    console.error("Error generating leads:", error);
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

    // Extract file URL if present in the prompt
    const fileUrlMatch = prompt.match(/https:\/\/.*?\.(?:pdf|txt|docx)/i);
    const fileUrl = fileUrlMatch ? fileUrlMatch[0] : null;

    let documentContent = "";
    if (fileUrl) {
      try {
        console.log("Attempting to fetch document from:", fileUrl);
        const response = await fetch(fileUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`);
        }

        // Convert the response to a File object
        const blob = await response.blob();
        const fileName = fileUrl.split('/').pop() || 'document';
        const file = new File([blob], fileName, { type: response.headers.get('content-type') || '' });

        // Parse the document content
        console.log("Parsing document content...");
        documentContent = await parseDocument(file);
        console.log("Successfully parsed document content");
      } catch (error) {
        console.error("Error processing document:", error);
        documentContent = "Error: Unable to process the document content. Please ensure the file is accessible and try again.";
      }
    }

    // Construct the final prompt with document content
    const finalPrompt = `
      ${prompt}
      
      ${documentContent ? `Document Content:
      ${documentContent}
      
      Please analyze this document content and provide a detailed response based on the user's request.` : ''}
    `;

    console.log("Sending final prompt to Gemini API");
    const result = await model.generateContent(finalPrompt);
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

export const generateTranslation = async (text: string, targetLanguage: string) => {
  try {
    console.log("Generating translation for text:", text, "to language:", targetLanguage);
    const apiKey = await getGeminiApiKey();
    console.log("Successfully retrieved API key");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`
      Please translate the following text to ${targetLanguage}:
      
      ${text}
      
      Please provide only the translated text without any additional comments or explanations.
    `);
    const response = await result.response;
    const translatedText = response.text();
    console.log("Received translation:", translatedText);
    return translatedText;
  } catch (error) {
    console.error("Error generating translation:", error);
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
      As a market analysis expert, please analyze the following request and provide detailed insights:
      
      ${prompt}
      
      Please include:
      1. Market Overview
      2. Key Trends and Patterns
      3. Competitive Analysis
      4. Growth Opportunities
      5. Potential Risks
      6. Strategic Recommendations
    `);
    const response = await result.response;
    const text = response.text();
    console.log("Received market analysis response:", text);
    return text;
  } catch (error) {
    console.error("Error generating market analysis:", error);
    throw error;
  }
};

export const analyzeJobSearch = async (params: {
  jobPlatform: string;
  keywords: string;
  jobType: string;
  location: string;
  resumeContent?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}) => {
  try {
    console.log("Analyzing job search with parameters:", params);
    
    const { data, error } = await supabase.functions.invoke('job-search', {
      body: params
    });
    
    if (error) {
      console.error("Error from job-search function:", error);
      throw new Error(`Failed to analyze job search: ${error.message}`);
    }
    
    return data.analysis;
  } catch (error) {
    console.error("Error in analyzeJobSearch:", error);
    throw error;
  }
};
