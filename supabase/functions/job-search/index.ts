import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { searchLinkedIn } from "./linkedinApi.ts";
import { searchZipRecruiter } from "./zipRecruiterApi.ts";
import { searchGlassdoor } from "./glassdoorApi.ts";
import { calculateMatchPercentage, generateAnalysis } from "./utils.ts";
import type { JobPosting, JobSearchParams } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: JobSearchParams = await req.json();
    const {
      jobPlatform,
      keywords,
      location,
      resumeContent
    } = params;

    console.log("Processing job search request with parameters:", {
      jobPlatform,
      keywords,
      location,
      resumeLength: resumeContent?.length
    });

    let allJobs: JobPosting[] = [];
    
    try {
      if (!jobPlatform || jobPlatform.toLowerCase() === 'linkedin') {
        const linkedInJobs = await searchLinkedIn(keywords, location);
        console.log(`Retrieved ${linkedInJobs.length} jobs from LinkedIn`);
        allJobs = [...allJobs, ...linkedInJobs];
      }
      
      if (!jobPlatform || jobPlatform.toLowerCase() === 'ziprecruiter') {
        const zipRecruiterJobs = await searchZipRecruiter(keywords, location);
        allJobs = [...allJobs, ...zipRecruiterJobs];
      }
      
      if (!jobPlatform || jobPlatform.toLowerCase() === 'glassdoor') {
        const glassdoorJobs = await searchGlassdoor(keywords, location);
        allJobs = [...allJobs, ...glassdoorJobs];
      }
    } catch (error) {
      console.error("Error searching job boards:", error);
    }

    allJobs = allJobs.map(job => ({
      ...job,
      matchPercentage: calculateMatchPercentage(job, resumeContent || '')
    }));

    allJobs.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

    const analysis = generateAnalysis(allJobs, jobPlatform);

    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error in job-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});