export interface JobSearchParams {
  query: string;
  location?: string;
  remote?: boolean;
}

export interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  postedDate?: string;
  source: string;
}

export interface ApiResponse {
  success: boolean;
  data?: JobResult[];
  error?: string;
}