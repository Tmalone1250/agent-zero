import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileInformationProps {
  resume: File | null;
  setResume: (file: File | null) => void;
  setResumeContent: (content: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (url: string) => void;
  githubUrl: string;
  setGithubUrl: (url: string) => void;
  portfolioUrl: string;
  setPortfolioUrl: (url: string) => void;
}

export const ProfileInformation = ({
  resume,
  setResume,
  setResumeContent,
  linkedinUrl,
  setLinkedinUrl,
  githubUrl,
  setGithubUrl,
  portfolioUrl,
  setPortfolioUrl,
}: ProfileInformationProps) => {
  const { toast } = useToast();

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setResume(file);
        
        // Read file content and extract key information
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          // Extract only the first 1000 characters to stay within token limits
          setResumeContent(text.substring(0, 1000));
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

  return (
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
  );
};