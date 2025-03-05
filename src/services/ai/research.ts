
import { callGeminiChat } from './config';

export const generateResearch = async (topic: string) => {
  try {
    console.log("Generating research for topic:", topic);

    const messages = [
      { role: "system", content: "You are a research assistant that provides comprehensive analysis on various topics." },
      { role: "user", content: `As a research assistant, please analyze the following topic and provide a comprehensive research analysis:
      
      ${topic}
      
      Please provide:
      1. Executive Summary
      2. Background Information
      3. Key Findings
      4. Analysis and Discussion
      5. Conclusions and Recommendations
      6. References and Further Reading
      
      Format the response in clear sections with detailed insights.` }
    ];

    const result = await callGeminiChat(messages);
    console.log("Received research analysis response");
    return result;
  } catch (error) {
    console.error("Error generating research:", error);
    throw error;
  }
};
