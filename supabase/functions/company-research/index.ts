
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received company research request");
    const { companyName, companyUrl, reportType, userId } = await req.json();
    console.log(`Generating research for ${companyName}, report type: ${reportType}`);

    let systemPrompt = "You are an expert business analyst and company researcher. ";

    switch (reportType) {
      case "company-profile":
        systemPrompt += "Create a detailed company profile including history, mission, key executives, and main products/services.";
        break;
      case "financial-analysis":
        systemPrompt += "Analyze the company's financial performance, including revenue trends, profitability, and key financial metrics.";
        break;
      case "market-position":
        systemPrompt += "Assess the company's market position, including market share, competitive advantages, and growth opportunities.";
        break;
      case "competitor-analysis":
        systemPrompt += "Identify and analyze key competitors, comparing their strengths, weaknesses, and market strategies.";
        break;
      case "industry-trends":
        systemPrompt += "Analyze current industry trends, future outlook, and how they impact the company.";
        break;
      default:
        systemPrompt += "Provide a comprehensive analysis of the company's business operations and market position.";
    }

    const prompt = `Research and analyze ${companyName}${companyUrl ? ` (${companyUrl})` : ''}. 
    Focus on providing detailed, data-driven insights for the specified report type.
    Format the response in clear sections with headings using Markdown.`;

    console.log("Initializing Gemini API");
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    
    // Update to use gemini-1.5-pro model instead of gemini-pro
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    console.log("Generating content with Gemini API");
    const result = await model.generateContent([
      { text: systemPrompt },
      { text: prompt }
    ]);

    const response = result.response;
    const text = response.text();
    console.log("Successfully generated company research");

    return new Response(
      JSON.stringify({ response: text }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in company-research function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
