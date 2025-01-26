import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateSeoOptimization } from "@/services/gemini";
import { Loader2 } from "lucide-react";

const SeoOptimizer = () => {
  const [content, setContent] = useState("");
  const [optimizedContent, setOptimizedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to optimize",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateSeoOptimization(content);
      setOptimizedContent(result);
      toast({
        title: "Success",
        description: "Content has been optimized for SEO",
      });
    } catch (error) {
      console.error("Error optimizing content:", error);
      toast({
        title: "Error",
        description: "Failed to optimize content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.96] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-8">
          SEO Optimizer
        </h1>
        
        <div className="grid gap-8">
          <Card className="p-6 bg-black/[0.96] border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="content" className="block text-lg text-white mb-2">
                  Enter your content
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the content you want to optimize for SEO..."
                  className="h-40 bg-neutral-900 text-white border-neutral-700"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  "Optimize Content"
                )}
              </Button>
            </form>
          </Card>

          {optimizedContent && (
            <Card className="p-6 bg-black/[0.96] border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Optimized Content
              </h2>
              <div className="bg-neutral-900 p-4 rounded-lg text-white whitespace-pre-wrap">
                {optimizedContent}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoOptimizer;