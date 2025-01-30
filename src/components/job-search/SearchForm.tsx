import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchParameters } from "./SearchParameters";
import { ProfileInformation } from "./ProfileInformation";

interface SearchFormProps {
  jobPlatform: string;
  setJobPlatform: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  jobType: string;
  setJobType: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  resume: File | null;
  setResume: (file: File | null) => void;
  setResumeContent: (content: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (url: string) => void;
  githubUrl: string;
  setGithubUrl: (url: string) => void;
  portfolioUrl: string;
  setPortfolioUrl: (url: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchForm = ({
  jobPlatform,
  setJobPlatform,
  keywords,
  setKeywords,
  jobType,
  setJobType,
  location,
  setLocation,
  resume,
  setResume,
  setResumeContent,
  linkedinUrl,
  setLinkedinUrl,
  githubUrl,
  setGithubUrl,
  portfolioUrl,
  setPortfolioUrl,
  onSearch,
  isLoading,
}: SearchFormProps) => {
  return (
    <>
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
          onClick={onSearch}
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Start Job Search"}
        </Button>
      </div>
    </>
  );
};