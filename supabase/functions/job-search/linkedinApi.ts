import { JobSearchParams, JobResult } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function searchLinkedInJobs(params: JobSearchParams): Promise<JobResult[]> {
  try {
    console.log('Searching LinkedIn jobs with params:', params);
    
    const apiKey = Deno.env.get('LINKEDIN_API_KEY');
    if (!apiKey) {
      throw new Error('LinkedIn API key not configured');
    }

    // Construct search query
    const queryParams = new URLSearchParams({
      keywords: params.query,
      location: params.location || 'United States',
      remote: params.remote ? 'true' : 'false',
    });

    const response = await fetch(
      `https://api.linkedin.com/v2/jobs/search?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('LinkedIn API response:', data);

    return data.elements.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company.name,
      location: job.location,
      description: job.description,
      url: job.applyUrl,
      postedDate: job.postedDate,
      source: 'LinkedIn'
    }));
  } catch (error) {
    console.error('LinkedIn API error:', error);
    throw error;
  }
}

export { corsHeaders };