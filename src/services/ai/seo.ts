
import { callOpenRouter } from './config';

export const generateSeoOptimization = async (content: string) => {
  try {
    console.log("Generating SEO optimization for content:", content);

    const messages = [
      { role: "system", content: "You are an SEO expert assistant. Analyze the provided content and provide detailed SEO recommendations." },
      { role: "user", content: `As an SEO expert, please analyze the following URL or content and provide a detailed report:

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
      4. Priority levels for each recommendation` }
    ];

    const result = await callOpenRouter(messages);
    console.log("Received SEO optimization response");
    return result;
  } catch (error) {
    console.error("Error generating SEO optimization:", error);
    throw error;
  }
};
