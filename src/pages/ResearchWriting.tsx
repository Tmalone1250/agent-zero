import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateContent } from "@/services/gemini";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ResearchWriting = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [citationStyle, setCitationStyle] = useState("apa");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, TXT, or DOCX file",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setUploadProgress(0);
  };

  const handleSubmit = async () => {
    if (!input.trim() && !file) {
      toast({
        title: "Input required",
        description: "Please enter your research query or upload a document to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponse("");
    try {
      let fileUrl = "";
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 100);

        const { error: uploadError, data } = await supabase.storage
          .from('academic_files')
          .upload(fileName, file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (uploadError) {
          throw new Error(`Error uploading file: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('academic_files')
          .getPublicUrl(fileName);
          
        fileUrl = publicUrl;
        
        toast({
          title: "File uploaded successfully",
          description: "Processing document content...",
        });
      }

      const prompt = `As a Research and Writing Assistant, please help with the following:
      ${input}
      ${fileUrl ? `\nPlease analyze the content from this file: ${fileUrl}` : ''}
      
      Please provide a comprehensive response that includes:
      1. Relevant scholarly articles and credible resources
      2. Citation formatting in ${citationStyle.toUpperCase()} style
      3. Writing style and grammar suggestions
      4. Plagiarism detection and rewriting suggestions if needed
      5. Additional research recommendations
      
      Format the response in a clear, structured way that's easy to understand.`;

      const result = await generateContent(prompt);
      setResponse(result);
    } catch (error) {
      console.error("Error generating research assistance:", error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.96] p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-white hover:text-white/80"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
          Research and Writing Assistant
        </h1>
        <p className="text-xl text-neutral-300 mb-8">
          Your AI research partner for academic writing excellence
        </p>

        <Card className="bg-black/[0.96] border-white/10 mb-6">
          <CardContent className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Upload Document (Optional)
              </label>
              <Input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleFileChange}
                className="bg-black/[0.96] border-white/10 text-white"
              />
              {file && (
                <div className="mt-2">
                  <p className="text-sm text-neutral-400">
                    Selected file: {file.name}
                  </p>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Citation Style
              </label>
              <Select
                value={citationStyle}
                onValueChange={setCitationStyle}
              >
                <SelectTrigger className="bg-black/[0.96] border-white/10 text-white">
                  <SelectValue placeholder="Select citation style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apa">APA</SelectItem>
                  <SelectItem value="mla">MLA</SelectItem>
                  <SelectItem value="chicago">Chicago</SelectItem>
                  <SelectItem value="harvard">Harvard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Enter your research topic, writing query, or text to analyze..."
              className="min-h-[150px] mb-4 bg-black/[0.96] border-white/10 text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get Research Assistance"
              )}
            </Button>
          </CardContent>
        </Card>

        {response && (
          <Card className="bg-black/[0.96] border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Response:</h2>
              <div className="text-neutral-300 whitespace-pre-wrap">{response}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResearchWriting;