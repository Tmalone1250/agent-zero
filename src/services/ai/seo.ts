
import { createGeminiClient, DEFAULT_MODEL_CONFIG } from './config';

export const generateSeoOptimization = async (content: string) => {
  try {
    console.log("Generating SEO optimization for content:", content);
    const genAI = await createGeminiClient();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.0-pro",
      generationConfig: DEFAULT_MODEL_CONFIG
    });

    const prompt = `As an SEO expert, please analyze the following URL or content and provide a detailed report:

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
    4. Priority levels for each recommendation`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Received SEO optimization response:", text);
    return text;
  } catch (error) {
    console.error("Error generating SEO optimization:", error);
    throw error;
  }
};
