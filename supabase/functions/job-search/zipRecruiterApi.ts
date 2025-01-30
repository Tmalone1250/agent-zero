import { JobPosting } from './types';

export async function searchZipRecruiter(keywords: string, location: string): Promise<JobPosting[]> {
  console.log("Searching ZipRecruiter for:", keywords, location);
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