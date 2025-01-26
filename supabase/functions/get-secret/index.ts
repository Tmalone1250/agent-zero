import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Received request for secret");
    const { secretName } = await req.json()
    
    if (!secretName) {
      console.error("No secret name provided");
      throw new Error('Secret name is required')
    }

    console.log(`Fetching secret: ${secretName}`);
    const secret = Deno.env.get(secretName)
    
    if (!secret) {
      console.error(`Secret ${secretName} not found`);
      throw new Error(`Secret ${secretName} not found`)
    }

    console.log("Successfully retrieved secret");
    return new Response(
      JSON.stringify({ [secretName]: secret }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Error in get-secret function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})