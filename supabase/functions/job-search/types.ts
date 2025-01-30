export interface JobPosting {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: string;
  contactInfo?: string;
  matchPercentage?: number;
}

export interface JobSearchParams {
  jobPlatform: string;
  keywords: string;
  jobType: string;
  location: string;
  resumeContent?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}