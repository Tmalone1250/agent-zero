import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { searchLinkedInJobs, corsHeaders } from "./linkedinApi.ts";
import { JobSearchParams, ApiResponse } from "./types.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, location, remote } = await req.json() as JobSearchParams;
    console.log('Received job search request:', { query, location, remote });

    if (!query) {
      throw new Error('Search query is required');
    }

    const linkedInJobs = await searchLinkedInJobs({ query, location, remote });
    
    const response: ApiResponse = {
      success: true,
      data: linkedInJobs,
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Job search error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: error.message,
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    );
  }
});