import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeJobSearch } from "@/services/gemini";

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

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setResume(file);
        
        // Read file content
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          setResumeContent(text);
        };
        reader.readAsText(file);
        
        toast({
          title: "Resume uploaded",
          description: "Your resume has been successfully uploaded.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file.",
        });
      }
    }
  };

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
            
            <div className="space-y-4">
              <div>
                <Label className="text-white">Job Platform</Label>
                <Select onValueChange={setJobPlatform}>
                  <SelectTrigger className="bg-black/[0.96] border-white/10 text-white">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/[0.96] border-white/10">
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="indeed">Indeed</SelectItem>
                    <SelectItem value="glassdoor">Glassdoor</SelectItem>
                    <SelectItem value="ziprecruiter">ZipRecruiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Keywords</Label>
                <Input
                  placeholder="e.g., Remote JavaScript Developer"
                  className="bg-black/[0.96] border-white/10 text-white"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-white">Job Type</Label>
                <Select onValueChange={setJobType}>
                  <SelectTrigger className="bg-black/[0.96] border-white/10 text-white">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/[0.96] border-white/10">
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Location</Label>
                <Input
                  placeholder="e.g., San Francisco, CA"
                  className="bg-black/[0.96] border-white/10 text-white"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/[0.96] border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-white">Resume</Label>
                <div className="mt-1">
                  <Label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center w-full h-32 px-4 transition bg-black/[0.96] border-2 border-white/10 border-dashed rounded-md appearance-none cursor-pointer hover:border-white/20"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-8 h-8 text-white" />
                      <span className="text-sm text-white">
                        {resume ? resume.name : "Upload your resume (PDF or DOCX)"}
                      </span>
                    </div>
                    <input
                      id="resume-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={handleResumeUpload}
                    />
                  </Label>
                </div>
              </div>

              <div>
                <Label className="text-white">LinkedIn Profile URL</Label>
                <Input
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="bg-black/[0.96] border-white/10 text-white"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-white">GitHub Profile URL</Label>
                <Input
                  placeholder="https://github.com/yourusername"
                  className="bg-black/[0.96] border-white/10 text-white"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-white">Portfolio URL</Label>
                <Input
                  placeholder="https://yourportfolio.com"
                  className="bg-black/[0.96] border-white/10 text-white"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                />
              </div>
            </div>
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

        {analysis && (
          <Card className="mt-6 p-6 bg-black/[0.96] border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Analysis Results</h2>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-white">{analysis}</pre>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobSearch;