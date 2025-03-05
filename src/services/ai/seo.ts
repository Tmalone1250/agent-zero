
import { callGeminiAPI } from './config';

export const generateSeoOptimization = async (content: string) => {
  try {
    console.log("Generating SEO optimization for content:", content.substring(0, 100) + "...");
    
    const prompt = `
      I need to optimize the following content for search engines:
      
      ${content}
      
      Please provide a complete analysis and recommendations for SEO optimization, including:
      
      1. Keyword analysis and suggestions
      2. Meta title and description recommendations
      3. Content structure improvements
      4. Readability improvements
      5. Internal and external linking suggestions
      6. Any other SEO recommendations that would help this content rank better
      
      Format your response as plain text with clear headings and bullet points where appropriate. Do not use markdown or any other formatting.
    `;
    
    const result = await callGeminiAPI(prompt);
    console.log("Received SEO optimization response");
    return result;
  } catch (error) {
    console.error("Error generating SEO optimization:", error);
    throw error;
  }
};
