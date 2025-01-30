import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobPosting {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: string;
  contactInfo?: string;
  matchPercentage?: number;
}

async function searchLinkedIn(keywords: string, location: string): Promise<JobPosting[]> {
  console.log("Searching LinkedIn with real API for:", keywords, location);
  
  const LINKEDIN_API_KEY = Deno.env.get("LINKEDIN_API_KEY");
  if (!LINKEDIN_API_KEY) {
    throw new Error("LinkedIn API key not found");
  }

  try {
    // LinkedIn Jobs Search API endpoint
    const baseUrl = 'https://api.linkedin.com/v2/jobSearch';
    const queryParams = new URLSearchParams({
      keywords: keywords,
      location: location || '',
      remoteFilter: 'REMOTE',  // Add remote filter
      limit: '10'  // Limit results for testing
    });

    console.log("Making LinkedIn API request to:", `${baseUrl}?${queryParams}`);

    const response = await fetch(`${baseUrl}?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${LINKEDIN_API_KEY}`,
        'Accept': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LinkedIn API error response:", errorText);
      throw new Error(`LinkedIn API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("LinkedIn API raw response:", JSON.stringify(data, null, 2));

    // Transform LinkedIn API response to our JobPosting format
    const jobs = data.elements?.map((job: any) => ({
      title: job.title?.text || 'No Title',
      company: job.companyDetails?.company?.name || 'Company Not Listed',
      location: job.formattedLocation || location || 'Remote',
      description: job.description?.text || 'No Description Available',
      url: job.applyUrl || `https://www.linkedin.com/jobs/view/${job.entityUrn.split(':').pop()}`,
      source: 'LinkedIn',
      contactInfo: job.applicationSettings?.email || undefined
    })) || [];

    console.log("Transformed LinkedIn jobs:", jobs);
    return jobs;
  } catch (error) {
    console.error("Error fetching from LinkedIn:", error);
    throw error;
  }
}

async function searchZipRecruiter(keywords: string, location: string): Promise<JobPosting[]> {
  console.log("Searching ZipRecruiter for:", keywords, location);
  // Note: This is a mock implementation. In a real scenario, you would integrate with ZipRecruiter's API
  return [{
    title: "Sample ZipRecruiter Job",
    company: "ZipRecruiter Company",
    location: location || "Remote",
    description: "This is a sample job posting from ZipRecruiter",
    url: "https://ziprecruiter.com/jobs/...",
    source: "ZipRecruiter",
    contactInfo: "hr@company.com"
  }];
}

async function searchGlassdoor(keywords: string, location: string): Promise<JobPosting[]> {
  console.log("Searching Glassdoor for:", keywords, location);
  // Note: This is a mock implementation. In a real scenario, you would integrate with Glassdoor's API
  return [{
    title: "Sample Glassdoor Job",
    company: "Glassdoor Company",
    location: location || "Remote",
    description: "This is a sample job posting from Glassdoor",
    url: "https://glassdoor.com/jobs/...",
    source: "Glassdoor",
    contactInfo: "careers@company.com"
  }];
}

function calculateMatchPercentage(jobPosting: JobPosting, resumeContent: string): number {
  if (!resumeContent) return 70;
  
  const relevantKeywords = ["javascript", "react", "typescript", "node"];
  let matches = 0;
  
  relevantKeywords.forEach(keyword => {
    if (jobPosting.description.toLowerCase().includes(keyword) && 
        resumeContent.toLowerCase().includes(keyword)) {
      matches++;
    }
  });
  
  return Math.min(100, 60 + (matches * 10));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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
    } = await req.json();

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
      // Continue with any jobs we were able to fetch
    }

    // Calculate match percentages
    allJobs = allJobs.map(job => ({
      ...job,
      matchPercentage: calculateMatchPercentage(job, resumeContent)
    }));

    // Sort jobs by match percentage
    allJobs.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

    const chatResponse = `I found ${allJobs.length} relevant job opportunities across ${
      jobPlatform ? jobPlatform : 'multiple job boards'
    }. The top match has a ${allJobs[0]?.matchPercentage}% match with your profile.`;

    const detailedAnalysis = `
Job Opportunities:
${allJobs.map(job => `
- ${job.title} at ${job.company}
  Location: ${job.location}
  Source: ${job.source}
  Match: ${job.matchPercentage}%
  Contact: ${job.contactInfo || 'Not available'}
  URL: ${job.url}
`).join('\n')}

Elevator Pitch:
Based on the job requirements and your profile, here's a suggested elevator pitch:
"I am a skilled professional with experience in ${keywords}. I am particularly interested in ${jobType || 'various'} roles and have a track record of success in delivering high-quality results."

Next Steps to Improve Application Success:
1. Customize your resume for each application, highlighting relevant skills
2. Follow up with the provided contact information within 48 hours
3. Research each company thoroughly before applying
4. Prepare specific examples of your work that align with job requirements
${linkedinUrl ? '5. Ensure your LinkedIn profile is up to date' : '5. Consider creating a LinkedIn profile'}
${githubUrl ? '6. Highlight relevant projects on your GitHub' : '6. Consider showcasing your code on GitHub'}
${portfolioUrl ? '7. Update your portfolio with recent work' : '7. Consider creating a portfolio to showcase your work'}`;

    return new Response(
      JSON.stringify({ 
        analysis: chatResponse + "\n---\n" + detailedAnalysis
      }),
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