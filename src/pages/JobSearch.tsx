import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { analyzeJobSearch } from "@/services/gemini";
import { SearchHeader } from "@/components/job-search/SearchHeader";
import { SearchForm } from "@/components/job-search/SearchForm";
import { SavedJobs } from "@/components/job-search/SavedJobs";
import { ChatInterface } from "@/components/job-search/ChatInterface";
import { AnalysisResults } from "@/components/job-search/AnalysisResults";

const JobSearch = () => {
  const { toast } = useToast();
  const [jobPlatform, setJobPlatform] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [jobType, setJobType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [resume, setResume] = useState<File | null>(null);
  const [resumeContent, setResumeContent] = useState<string>("");
  const [linkedinUrl, setLinkedinUrl] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [portfolioUrl, setPortfolioUrl] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "Starting job search",
        description: "Please wait while we analyze job opportunities...",
      });
      
      const result = await analyzeJobSearch({
        jobPlatform,
        keywords,
        jobType,
        location,
        resumeContent,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
      });
      
      setAnalysis(result);
      
      toast({
        title: "Analysis complete",
        description: "Job opportunities have been analyzed.",
      });
    } catch (error) {
      console.error("Error during job search:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during the job search. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatMessage = async (message: string) => {
    try {
      setIsLoading(true);
      const result = await analyzeJobSearch({
        jobPlatform,
        keywords: message,
        jobType,
        location,
        resumeContent,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
      });
      
      setAnalysis(result);
      return result;
    } catch (error) {
      console.error("Error processing chat message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.96] p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <SearchHeader />
        
        <SearchForm
          jobPlatform={jobPlatform}
          setJobPlatform={setJobPlatform}
          keywords={keywords}
          setKeywords={setKeywords}
          jobType={jobType}
          setJobType={setJobType}
          location={location}
          setLocation={setLocation}
          resume={resume}
          setResume={setResume}
          setResumeContent={setResumeContent}
          linkedinUrl={linkedinUrl}
          setLinkedinUrl={setLinkedinUrl}
          githubUrl={githubUrl}
          setGithubUrl={setGithubUrl}
          portfolioUrl={portfolioUrl}
          setPortfolioUrl={setPortfolioUrl}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        <SavedJobs />
        <ChatInterface onSendMessage={handleChatMessage} isLoading={isLoading} />
        <AnalysisResults analysis={analysis} />
      </div>
    </div>
  );
};

export default JobSearch;