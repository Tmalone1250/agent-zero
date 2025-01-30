import { JobPosting } from './types';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function searchLinkedIn(keywords: string, location: string): Promise<JobPosting[]> {
  console.log("Searching LinkedIn with real API for:", keywords, location);
  
  const LINKEDIN_API_KEY = Deno.env.get("LINKEDIN_API_KEY");
  if (!LINKEDIN_API_KEY) {
    throw new Error("LinkedIn API key not found");
  }

  try {
    const baseUrl = 'https://api.linkedin.com/v2/jobSearch';
    const queryParams = new URLSearchParams({
      keywords: keywords,
      location: location || '',
      remoteFilter: 'REMOTE',
      limit: '10'
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