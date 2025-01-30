import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

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
  console.log("Searching LinkedIn for:", keywords, location);
  // Note: This is a mock implementation. In a real scenario, you would integrate with LinkedIn's API
  return [{
    title: "Sample LinkedIn Job",
    company: "LinkedIn Company",
    location: location || "Remote",
    description: "This is a sample job posting from LinkedIn",
    url: "https://linkedin.com/jobs/...",
    source: "LinkedIn",
    contactInfo: "recruiter@company.com"
  }];
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
  // This is a simple mock implementation of match calculation
  // In a real scenario, you would use more sophisticated matching algorithms
  if (!resumeContent) return 70; // Default match if no resume provided
  
  const relevantKeywords = ["javascript", "react", "typescript", "node"];
  let matches = 0;
  
  relevantKeywords.forEach(keyword => {
    if (jobPosting.description.toLowerCase().includes(keyword) && 
        resumeContent.toLowerCase().includes(keyword)) {
      matches++;
    }
  });
  
  return Math.min(100, 60 + (matches * 10)); // Base 60% + 10% per keyword match
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

    // Search all platforms or specific platform based on jobPlatform parameter
    let allJobs: JobPosting[] = [];
    
    if (!jobPlatform || jobPlatform.toLowerCase() === 'linkedin') {
      const linkedInJobs = await searchLinkedIn(keywords, location);
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

    // Calculate match percentages
    allJobs = allJobs.map(job => ({
      ...job,
      matchPercentage: calculateMatchPercentage(job, resumeContent)
    }));

    // Sort jobs by match percentage
    allJobs.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

    // Generate chat response and detailed analysis
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
  Contact: ${job.contactInfo}
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