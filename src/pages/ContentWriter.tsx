import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Link } from "react-router-dom";
import { generateContent } from "@/services/gemini";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const ContentWriter = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await generateContent(prompt);
      setResponse(result);
      toast({
        title: "Content generated successfully",
        description: "Check out the response below",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error generating content",
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
        <Link
          to="/dashboard"
          className="inline-flex items-center text-neutral-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
          Content Writer
        </h1>
        <p className="text-xl text-neutral-300 mb-8">
          Professional content generation assistant
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-lg text-white mb-2">
              What would you like help with?
            </label>
            <Textarea
              id="prompt"
              placeholder="Describe what content you'd like to generate..."
              className="min-h-[200px] bg-neutral-900 text-white border-neutral-700"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Submit Request"}
          </Button>
        </form>

        {response && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Generated Content:</h2>
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700">
              <pre className="text-white whitespace-pre-wrap">{response}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentWriter;