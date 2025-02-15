
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
    const { prompt, service, userId } = await req.json();

    let systemPrompt = "You are an experienced career coach and professional advisor. ";

    switch (service) {
      case "career-advice":
        systemPrompt += "Provide personalized career advice based on the user's background and goals. Focus on actionable steps and industry insights.";
        break;
      case "resume-tips":
        systemPrompt += "Analyze resumes and provide specific, actionable feedback for improvement. Focus on formatting, content, and keywords that will help the resume stand out.";
        break;
      case "interview-prep":
        systemPrompt += "Provide interview preparation advice, including common questions, suggested answers, and tips for success. Consider both technical and behavioral aspects.";
        break;
      case "skill-gap":
        systemPrompt += "Analyze the user's current skills and career goals to identify gaps. Suggest specific resources and learning paths for improvement.";
        break;
      case "job-search":
        systemPrompt += "Provide job search strategies and suggestions based on the user's preferences and background. Include tips for networking and application processes.";
        break;
      default:
        systemPrompt += "Provide general career guidance and professional development advice.";
    }

    // Call Gemini API for response generation
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: prompt }
    ]);

    const response = result.response;
    const text = response.text();

    return new Response(
      JSON.stringify({ response: text }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in career-coach function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
