import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateDataAnalysis } from "@/services/gemini";
import { useToast } from "@/hooks/use-toast";

const DataAnalyzer = () => {
  const [data, setData] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await generateDataAnalysis(data);
      setAnalysis(result);
      toast({
        title: "Analysis completed",
        description: "Check out the analysis below",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error analyzing data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.96] p-8">
      <div className="max-w-3xl mx-auto">
        <Button 
          onClick={() => navigate("/marketplace")}
          variant="ghost" 
          className="mb-8 text-white hover:text-purple-400"
        >
          ← Back to Marketplace
        </Button>

        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
          Data Analyzer
        </h1>
        <p className="text-xl text-neutral-300 mb-8">
          Advanced data analysis powered by AI
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="data" className="block text-lg text-white mb-2">
              Enter your data for analysis
            </label>
            <Textarea
              id="data"
              placeholder="Paste your data here (CSV, JSON, or plain text)..."
              className="min-h-[200px] bg-neutral-900 text-white border-neutral-700"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Data"}
          </Button>
        </form>

        {analysis && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Analysis Results:</h2>
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700">
              <pre className="text-white whitespace-pre-wrap">{analysis}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataAnalyzer;