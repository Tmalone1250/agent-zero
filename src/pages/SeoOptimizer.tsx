import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateSeoOptimization } from "@/services/ai";

const SeoOptimizer = () => {
  const [content, setContent] = useState("");
  const [optimization, setOptimization] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter content to optimize",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateSeoOptimization(content);
      setOptimization(result);
      toast({
        title: "Success",
        description: "SEO optimization generated successfully",
      });
    } catch (error) {
      console.error("Error generating SEO optimization:", error);
      toast({
        title: "Error",
        description: "Failed to generate SEO optimization. Please try again.",
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
            SEO Optimizer
          </h1>
          <p className="text-lg text-neutral-300">
            Optimize your content for search engines.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Textarea
              placeholder="Enter your content or URL to optimize..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-32 bg-black/50 border-white/10 text-white"
            />
          </div>

          <Button
            onClick={handleOptimize}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              "Optimizing..."
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Optimize Content
              </>
            )}
          </Button>

          {optimization && (
            <div className="mt-8">
              <div className="p-6 rounded-lg bg-black/50 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">SEO Recommendations</h2>
                <div className="text-neutral-300 whitespace-pre-wrap">{optimization}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoOptimizer;
