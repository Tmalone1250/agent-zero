
import { createGeminiClient, DEFAULT_MODEL_CONFIG } from './config';

export const generateResearch = async (topic: string) => {
  try {
    console.log("Generating research for topic:", topic);
    const genAI = await createGeminiClient();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.0-pro",
      generationConfig: DEFAULT_MODEL_CONFIG
    });

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
