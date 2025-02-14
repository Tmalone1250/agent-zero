
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Download, Copy, Share2, Printer, LinkedinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  name: string;
  display_name: string;
  industry: string;
  preview_image_url: string | null;
}

interface ResumeContent {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
  };
  workExperience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    description?: string;
  }>;
  skills: string[];
  languages: string[];
}

const ResumeBuilder = () => {
  const [activeTemplate, setActiveTemplate] = useState<string>("modern");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [content, setContent] = useState<ResumeContent>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
    },
    workExperience: [{
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      achievements: [],
    }],
    education: [{
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
    }],
    skills: [],
    languages: [],
  });
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('resume_templates')
      .select('*');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load resume templates",
        variant: "destructive",
      });
      return;
    }

    setTemplates(data);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // TODO: Implement resume parsing logic
    toast({
      title: "Coming Soon",
      description: "Resume parsing functionality will be available soon",
    });
  };

  const handleLinkedInImport = async () => {
    // TODO: Implement LinkedIn import
    toast({
      title: "Coming Soon",
      description: "LinkedIn import functionality will be available soon",
    });
  };

  const saveResume = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your resume",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: content.personalInfo.fullName + "'s Resume",
          template_name: activeTemplate,
          content: content,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Resume saved successfully",
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive",
      });
    }
  };

  const steps = [
    {
      title: "Template",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`p-4 cursor-pointer transition-all ${
                activeTemplate === template.name
                  ? "border-purple-500 shadow-lg"
                  : "border-white/10"
              }`}
              onClick={() => setActiveTemplate(template.name)}
            >
              <div className="aspect-[8.5/11] bg-white/5 mb-4 rounded-lg"></div>
              <h3 className="text-lg font-semibold text-white">{template.display_name}</h3>
              <p className="text-sm text-neutral-400">{template.industry}</p>
            </Card>
          ))}
        </div>
      ),
    },
    {
      title: "Personal Info",
      component: (
        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={content.personalInfo.fullName}
            onChange={(e) => setContent({
              ...content,
              personalInfo: { ...content.personalInfo, fullName: e.target.value }
            })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={content.personalInfo.email}
            onChange={(e) => setContent({
              ...content,
              personalInfo: { ...content.personalInfo, email: e.target.value }
            })}
          />
          <Input
            placeholder="Phone"
            value={content.personalInfo.phone}
            onChange={(e) => setContent({
              ...content,
              personalInfo: { ...content.personalInfo, phone: e.target.value }
            })}
          />
          <Input
            placeholder="Location"
            value={content.personalInfo.location}
            onChange={(e) => setContent({
              ...content,
              personalInfo: { ...content.personalInfo, location: e.target.value }
            })}
          />
          <Input
            placeholder="LinkedIn Profile URL"
            value={content.personalInfo.linkedIn}
            onChange={(e) => setContent({
              ...content,
              personalInfo: { ...content.personalInfo, linkedIn: e.target.value }
            })}
          />
        </div>
      ),
    },
    // Additional steps will be implemented in the next iteration
  ];

  return (
    <div className="min-h-screen bg-black/[0.96] p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-neutral-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Resume Builder
          </h1>
          <p className="text-xl text-neutral-300">
            Create a professional resume with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-black/50 border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Build Your Resume</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resume
                </Button>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLinkedInImport}
                >
                  <LinkedinIcon className="w-4 h-4 mr-2" />
                  Import from LinkedIn
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                {steps.map((step, index) => (
                  <Button
                    key={index}
                    variant={currentStep === index ? "default" : "outline"}
                    onClick={() => setCurrentStep(index)}
                  >
                    {step.title}
                  </Button>
                ))}
              </div>

              {steps[currentStep].component}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => {
                    if (currentStep === steps.length - 1) {
                      saveResume();
                    } else {
                      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
                    }
                  }}
                >
                  {currentStep === steps.length - 1 ? "Save Resume" : "Next"}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/50 border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Preview</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>

            <div className="aspect-[8.5/11] bg-white rounded-lg p-8">
              {/* Preview content will be implemented in the next iteration */}
              <div className="text-black">
                <h1 className="text-2xl font-bold">{content.personalInfo.fullName}</h1>
                <div className="text-sm text-gray-600 mt-2">
                  {content.personalInfo.email && (
                    <p>{content.personalInfo.email}</p>
                  )}
                  {content.personalInfo.phone && (
                    <p>{content.personalInfo.phone}</p>
                  )}
                  {content.personalInfo.location && (
                    <p>{content.personalInfo.location}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
