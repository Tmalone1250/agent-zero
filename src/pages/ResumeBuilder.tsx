
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
import { Database } from "@/integrations/supabase/types";

type Json = Database['public']['Tables']['resumes']['Insert']['content'];

interface Template {
  id: string;
  name: string;
  display_name: string;
  industry: string;
  preview_image_url: string | null;
}

interface ResumeContent {
  [key: string]: unknown;
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
    
    // Check for LinkedIn OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code')) {
      handleLinkedInCallback(urlParams.get('code') || '');
    }
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

    toast({
      title: "Coming Soon",
      description: "Resume parsing functionality will be available soon",
    });
  };

  const handleLinkedInImport = async () => {
    try {
      const clientId = await getLinkedInClientId();
      const redirectUri = window.location.origin + '/resume-builder';
      const scope = 'openid profile email w_member_social';  // Updated to use available scopes
      const state = Math.random().toString(36).substring(7);
      
      // Store state for verification
      localStorage.setItem('linkedin_oauth_state', state);
      
      // Open LinkedIn OAuth in a popup window
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;
      
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        'LinkedIn Login',
        `width=${width},height=${height},left=${left},top=${top},popup=true`
      );

      // Poll for popup closure and check for auth code
      const pollTimer = setInterval(() => {
        try {
          if (popup?.closed) {
            clearInterval(pollTimer);
            // Check if we have the auth code in storage
            const authCode = localStorage.getItem('linkedin_auth_code');
            const authState = localStorage.getItem('linkedin_auth_state');
            if (authCode && authState === state) {
              handleLinkedInCallback(authCode);
              localStorage.removeItem('linkedin_auth_code');
              localStorage.removeItem('linkedin_auth_state');
            }
          }
        } catch (e) {
          // Ignore cross-origin frame access errors
        }
      }, 500);

    } catch (error) {
      console.error('LinkedIn import error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate LinkedIn import",
        variant: "destructive",
      });
    }
  };

  const getLinkedInClientId = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-secret', {
        body: { secretName: 'LINKEDIN_API_KEY' },
      });

      if (error) throw error;
      return data.LINKEDIN_API_KEY;
    } catch (error) {
      console.error('Error getting LinkedIn client ID:', error);
      throw error;
    }
  };

  const handleLinkedInCallback = async (code: string) => {
    try {
      const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: window.location.origin + '/resume-builder',
          client_id: await getLinkedInClientId(),
          client_secret: await getLinkedInSecret(),
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get access token');
      }

      const { access_token } = await tokenResponse.json();

      const { data: profileData, error: profileError } = await supabase.functions.invoke('linkedin-import', {
        body: { access_token },
      });

      if (profileError) throw profileError;

      setContent(prevContent => ({
        ...prevContent,
        personalInfo: {
          ...prevContent.personalInfo,
          ...profileData.personalInfo,
        },
        workExperience: [
          ...profileData.workExperience,
        ],
      }));

      toast({
        title: "Success",
        description: "LinkedIn profile imported successfully",
      });
    } catch (error) {
      console.error('LinkedIn callback error:', error);
      toast({
        title: "Error",
        description: "Failed to import LinkedIn profile",
        variant: "destructive",
      });
    } finally {
      localStorage.removeItem('linkedin_oauth_state');
    }
  };

  const getLinkedInSecret = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-secret', {
        body: { secretName: 'LINKEDIN_SECRET' },
      });

      if (error) throw error;
      return data.LINKEDIN_SECRET;
    } catch (error) {
      console.error('Error getting LinkedIn secret:', error);
      throw error;
    }
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

      const resumeData = {
        user_id: user.id,
        title: content.personalInfo.fullName + "'s Resume",
        template_name: activeTemplate,
        content: content as Json,
      };

      const { error } = await supabase
        .from('resumes')
        .insert(resumeData);

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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin) {
        const { code, state } = event.data;
        if (code && state) {
          localStorage.setItem('linkedin_auth_code', code);
          localStorage.setItem('linkedin_auth_state', state);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
