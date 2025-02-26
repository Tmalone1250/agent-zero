import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateCodeAssistantResponse } from "@/services/ai";

const CodeAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateCodeAssistantResponse(prompt);
      setResponse(result);
      toast({
        title: "Success",
        description: "Code generated successfully",
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Error",
        description: "Failed to generate code. Please try again.",
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

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Code Assistant
          </h1>
          <p className="text-lg text-neutral-300">
            Get help with coding questions and problems.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Textarea
              placeholder="Describe your coding question or problem..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 bg-black/50 border-white/10 text-white"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              "Generating..."
            ) : (
              <>
                <Code className="w-4 h-4 mr-2" />
                Generate Solution
              </>
            )}
          </Button>

          {response && (
            <div className="mt-8">
              <div className="p-6 rounded-lg bg-black/50 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Solution</h2>
                <div className="text-neutral-300 whitespace-pre-wrap">{response}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeAssistant;
