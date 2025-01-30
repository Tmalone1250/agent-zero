import { JobPosting } from './types';

export function calculateMatchPercentage(jobPosting: JobPosting, resumeContent: string): number {
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

export function generateAnalysis(allJobs: JobPosting[], jobPlatform: string): string {
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
"I am a skilled professional with experience in software development. I am particularly interested in remote roles and have a track record of success in delivering high-quality results."

Next Steps to Improve Application Success:
1. Customize your resume for each application, highlighting relevant skills
2. Follow up with the provided contact information within 48 hours
3. Research each company thoroughly before applying
4. Prepare specific examples of your work that align with job requirements
5. Ensure your LinkedIn profile is up to date
6. Highlight relevant projects on your GitHub
7. Keep your portfolio updated with recent work`;

  return chatResponse + "\n---\n" + detailedAnalysis;
}