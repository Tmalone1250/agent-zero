import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateMarketAnalysis } from "@/services/gemini";

const MarketAnalyst = () => {
  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a market analysis request",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await generateMarketAnalysis(prompt);
      setAnalysis(response);
      toast({
        title: "Success",
        description: "Market analysis generated successfully",
      });
    } catch (error) {
      console.error("Error generating market analysis:", error);
      toast({
        title: "Error",
        description: "Failed to generate market analysis. Please try again.",
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
          to="/marketplace"
          className="inline-flex items-center text-neutral-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Market Analyst
          </h1>
          <p className="text-lg text-neutral-300">
            Get detailed market analysis and insights for your business decisions.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Textarea
              placeholder="Enter your market analysis request (e.g., 'Analyze the current trends in the electric vehicle market')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 bg-black/50 border-white/10 text-white"
            />
          </div>

          <Button
            onClick={handleAnalysis}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              "Analyzing..."
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate Analysis
              </>
            )}
          </Button>

          {analysis && (
            <div className="mt-8 p-6 rounded-lg bg-black/50 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Analysis Results</h2>
              <div className="text-neutral-300 whitespace-pre-wrap">{analysis}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketAnalyst;