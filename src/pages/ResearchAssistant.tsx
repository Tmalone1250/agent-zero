
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateResearch } from "@/services/gemini";

const ResearchAssistant = () => {
  const [topic, setTopic] = useState("");
  const [research, setResearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a research topic",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateResearch(topic);
      setResearch(result);
      toast({
        title: "Success",
        description: "Research generated successfully",
      });
    } catch (error) {
      console.error("Error generating research:", error);
      toast({
        title: "Error",
        description: "Failed to generate research. Please try again.",
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
            Research Assistant
          </h1>
          <p className="text-lg text-neutral-300">
            Get comprehensive research analysis on any topic.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Textarea
              placeholder="Enter your research topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
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
                <Search className="w-4 h-4 mr-2" />
                Generate Research
              </>
            )}
          </Button>

          {research && (
            <div className="mt-8">
              <div className="p-6 rounded-lg bg-black/50 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Research Analysis</h2>
                <div className="text-neutral-300 whitespace-pre-wrap">{research}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchAssistant;
