import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.1.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const {
      jobPlatform,
      keywords,
      jobType,
      location,
      resumeContent,
      linkedinUrl,
      githubUrl,
      portfolioUrl
    } = await req.json()

    console.log("Processing job search request with parameters:", {
      jobPlatform,
      keywords,
      jobType,
      location,
      resumeLength: resumeContent?.length,
      hasLinkedIn: !!linkedinUrl,
      hasGithub: !!githubUrl,
      hasPortfolio: !!portfolioUrl
    });

    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') ?? '')
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
      As a job search assistant, analyze the following request and provide detailed job search insights:
      
      User Request: ${keywords}
      Job Platform: ${jobPlatform || 'Any'}
      Job Type: ${jobType || 'Any'}
      Location: ${location || 'Any'}
      
      Resume Summary: ${resumeContent ? `${resumeContent.substring(0, 500)}...` : 'Not provided'}
      LinkedIn Profile: ${linkedinUrl || 'Not provided'}
      GitHub Profile: ${githubUrl || 'Not provided'}
      Portfolio: ${portfolioUrl || 'Not provided'}
      
      Please provide a response in the following format:

      1. A brief chat response summarizing the key findings
      2. Followed by "---" as a separator
      3. Then a detailed analysis including:
         - List of relevant job opportunities with company names and contact info
         - Match percentage for each role
         - A personalized elevator pitch
         - Specific next steps to improve application success
      
      Keep the chat response concise and conversational, with the detailed analysis below the separator.
    `

    console.log("Sending prompt to Gemini API");
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    console.log("Received response from Gemini API");

    return new Response(
      JSON.stringify({ analysis: text }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    console.error('Error in job-search function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})