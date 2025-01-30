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
      As a job search assistant, analyze the following information and provide relevant job opportunities:
      
      Job Platform: ${jobPlatform}
      Keywords: ${keywords}
      Job Type: ${jobType}
      Location: ${location}
      
      Resume Summary: ${resumeContent ? `${resumeContent.substring(0, 500)}...` : 'Not provided'}
      LinkedIn Profile: ${linkedinUrl || 'Not provided'}
      GitHub Profile: ${githubUrl || 'Not provided'}
      Portfolio: ${portfolioUrl || 'Not provided'}
      
      Please provide:
      1. A list of 3-5 relevant job opportunities based on the platform and criteria
      2. Match percentage for each role based on the provided information
      3. A short, personalized elevator pitch (max 100 words)
      4. 3 specific next steps to improve application success
      
      Format the response in clear sections with actionable insights.
      Keep the response concise and focused on the most relevant opportunities.
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