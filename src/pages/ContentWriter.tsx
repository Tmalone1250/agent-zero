'use client'

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateContent } from "@/services/gemini";
import { Loader2 } from "lucide-react";

const ContentWriter = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const content = await generateContent(prompt);
      setResponse(content);
      toast({
        title: "Success",
        description: "Content generated successfully",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
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
          Content Writer
        </h1>

        <Card className="p-6 bg-black/[0.96] border-white/10 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Textarea
                placeholder="Enter your content requirements..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-black/[0.96] border-white/10 text-white"
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
                  Generating...
                </>
              ) : (
                "Generate Content"
              )}
            </Button>
          </form>
        </Card>

        {response && (
          <Card className="p-6 bg-black/[0.96] border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Generated Content</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-neutral-300 whitespace-pre-wrap">{response}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentWriter;