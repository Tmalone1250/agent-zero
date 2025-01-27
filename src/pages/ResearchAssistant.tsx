import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateResearch } from "@/services/gemini";

const ResearchAssistant = () => {
  const [topic, setTopic] = useState("");
  const [research, setResearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const response = await generateResearch(topic);
      setResearch(response);
      toast({
        title: "Success",
        description: "Research analysis generated successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate research analysis",
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
          className="inline-flex items-center text-neutral-300 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Research Assistant
          </h1>
          <p className="text-xl text-neutral-300">
            Enter your research topic and receive a comprehensive analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Textarea
              placeholder="Enter your research topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[120px] bg-black/50 border-white/10 text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isLoading ? (
              <span className="flex items-center">
                <BookOpen className="animate-spin mr-2" />
                Researching...
              </span>
            ) : (
              "Generate Research"
            )}
          </Button>
        </form>

        {research && (
          <div className="mt-8 p-6 rounded-lg bg-black/50 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Research Analysis</h2>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-neutral-300">{research}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchAssistant;