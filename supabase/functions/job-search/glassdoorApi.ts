import { JobPosting } from './types';

export async function searchGlassdoor(keywords: string, location: string): Promise<JobPosting[]> {
  console.log("Searching Glassdoor for:", keywords, location);
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