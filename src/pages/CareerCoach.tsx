
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CareerCoach = () => {
  const [userInput, setUserInput] = useState("");
  const [selectedService, setSelectedService] = useState("career-advice");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      // Process the resume file
      // Implement resume processing logic here
      
      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter your question or upload a resume",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use the Career Coach",
          variant: "destructive",
        });
        return;
      }

      // Call the appropriate function based on the selected service
      const { data, error } = await supabase.functions.invoke('career-coach', {
        body: {
          prompt: userInput,
          service: selectedService,
          userId: user.id,
        },
      });

      if (error) throw error;

      setResponse(data.response);
      toast({
        title: "Success",
        description: "Response generated successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.96] p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-neutral-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Career Coach AI
          </h1>
          <p className="text-xl text-neutral-300">
            Your personal AI career advisor and interview preparation assistant
          </p>
        </div>

        <Card className="p-6 bg-black/50 border-white/10 mb-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="career-advice">Career Advice</SelectItem>
                  <SelectItem value="resume-tips">Resume Tips</SelectItem>
                  <SelectItem value="interview-prep">Interview Prep</SelectItem>
                  <SelectItem value="skill-gap">Skill Gap Analysis</SelectItem>
                  <SelectItem value="job-search">Job Search</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => document.getElementById('resumeUpload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </Button>
              <input
                id="resumeUpload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
            </div>

            <Textarea
              placeholder="Ask me anything about your career goals, resume tips, or interview preparation..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-[100px]"
            />

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                "Generating response..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Get Advice
                </>
              )}
            </Button>
          </div>
        </Card>

        {response && (
          <Card className="p-6 bg-black/50 border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Response</h2>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{response}</div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CareerCoach;
