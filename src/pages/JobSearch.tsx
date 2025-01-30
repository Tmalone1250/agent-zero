import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeJobSearch } from "@/services/gemini";
import { SearchParameters } from "@/components/job-search/SearchParameters";
import { ProfileInformation } from "@/components/job-search/ProfileInformation";
import { AnalysisResults } from "@/components/job-search/AnalysisResults";

const JobSearch = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-black/[0.96] p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-white hover:text-white/80"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-8">
          Job Search Assistant
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-black/[0.96] border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Search Parameters</h2>
            <SearchParameters
              jobPlatform={jobPlatform}
              setJobPlatform={setJobPlatform}
              keywords={keywords}
              setKeywords={setKeywords}
              jobType={jobType}
              setJobType={setJobType}
              location={location}
              setLocation={setLocation}
            />
          </Card>

          <Card className="p-6 bg-black/[0.96] border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Profile Information</h2>
            <ProfileInformation
              resume={resume}
              setResume={setResume}
              setResumeContent={setResumeContent}
              linkedinUrl={linkedinUrl}
              setLinkedinUrl={setLinkedinUrl}
              githubUrl={githubUrl}
              setGithubUrl={setGithubUrl}
              portfolioUrl={portfolioUrl}
              setPortfolioUrl={setPortfolioUrl}
            />
          </Card>
        </div>

        <div className="mt-6">
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Start Job Search"}
          </Button>
        </div>

        <AnalysisResults analysis={analysis} />
      </div>
    </div>
  );
};

export default JobSearch;