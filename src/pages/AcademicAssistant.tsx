import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { generateContent } from "@/services/gemini";

const AcademicAssistant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter your academic query or content to process.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `As an Academic Assistant, please help with the following:
      ${input}
      
      Please provide a comprehensive response that includes:
      1. A clear explanation of the topic
      2. Key concepts broken down into simpler terms
      3. Examples or analogies to aid understanding
      4. Practice questions or exercises if applicable
      5. Additional resources for further learning
      
      Format the response in a clear, structured way that's easy to understand.`;

      const result = await generateContent(prompt);
      setResponse(result);
    } catch (error) {
      console.error("Error generating academic assistance:", error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          Academic Assistant
        </h1>
        <p className="text-xl text-neutral-300 mb-8">
          Your personal AI tutor for learning and understanding complex topics
        </p>

        <Card className="bg-black/[0.96] border-white/10 mb-6">
          <CardContent className="p-6">
            <Textarea
              placeholder="Enter your academic query, text to summarize, or topic to learn about..."
              className="min-h-[150px] mb-4 bg-black/[0.96] border-white/10 text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Get Academic Assistance"}
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

export default AcademicAssistant;