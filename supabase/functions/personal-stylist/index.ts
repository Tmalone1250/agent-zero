
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
    const { prompt, service, userId, preferences } = await req.json();

    let systemPrompt = "You are an expert personal stylist and fashion advisor. ";

    switch (service) {
      case "fashion-advice":
        systemPrompt += "Provide personalized fashion advice based on the user's preferences, style, and body type. Focus on creating a cohesive and flattering wardrobe.";
        break;
      case "outfit-recommendations":
        systemPrompt += "Create specific outfit combinations for different occasions, considering color harmony, style compatibility, and current trends.";
        break;
      case "wardrobe-analysis":
        systemPrompt += "Analyze the user's wardrobe and provide suggestions for essential pieces, versatile combinations, and items to consider removing.";
        break;
      case "trend-analysis":
        systemPrompt += "Share insights about current fashion trends, upcoming seasonal styles, and how to incorporate them into a personal wardrobe.";
        break;
      case "shopping-assistance":
        systemPrompt += "Provide specific shopping recommendations within the user's budget, including where to find items and what to look for in terms of quality and fit.";
        break;
      default:
        systemPrompt += "Provide general fashion and style guidance tailored to the user's needs.";
    }

    if (preferences) {
      systemPrompt += `\nUser Preferences: Style types: ${preferences.style_type?.join(', ')}, Body type: ${preferences.body_type}, Favorite colors: ${preferences.favorite_colors?.join(', ')}, Budget range: ${preferences.budget_range}`;
    }

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
    console.error('Error in personal-stylist function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
