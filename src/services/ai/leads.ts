
import { callOpenRouter } from './config';

export const generateLeads = async (prompt: string) => {
  try {
    console.log("Generating leads for prompt:", prompt);

    const messages = [
      { role: "system", content: "You are a lead generation specialist who helps businesses identify potential customers." },
      { role: "user", content: `As a lead generation expert, please analyze the following request and generate potential business leads:
      
      ${prompt}
      
      Please provide a structured response with:
      1. Target Market Analysis
      2. Ideal Customer Profile
      3. List of Potential Leads (with company names, contact roles)
      4. Outreach Strategy
      5. Follow-up Recommendations
      
      Format the response in clear sections with actionable insights.` }
    ];

    const result = await callOpenRouter(messages);
    console.log("Received lead generation response");
    return result;
  } catch (error) {
    console.error("Error generating leads:", error);
    throw error;
  }
};
