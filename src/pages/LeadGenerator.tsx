import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Target, Users, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateLeads } from "@/services/gemini";
import { Card } from "@/components/ui/card";

const LeadGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [leads, setLeads] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description of your target market and leads requirements.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await generateLeads(prompt);
      setLeads(response);
      toast({
        title: "Success",
        description: "Lead generation completed successfully!",
      });
    } catch (error) {
      console.error("Error generating leads:", error);
      toast({
        title: "Error",
        description: "Failed to generate leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.96] p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-neutral-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Lead Generator
          </h1>
          <p className="text-xl text-neutral-400">
            Generate qualified business leads and outreach strategies tailored to your target market.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-black/[0.96] border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-neutral-200 mb-2">
                  Describe your target market and leads requirements
                </label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Looking for B2B SaaS companies in the healthcare sector with 50+ employees..."
                  className="h-40 bg-black/50 border-white/10 text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? "Generating Leads..." : "Generate Leads"}
              </Button>
            </form>
          </Card>

          <Card className="p-6 bg-black/[0.96] border-white/10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Generated Leads</h2>
              <div className="flex space-x-2">
                <Target className="w-5 h-5 text-purple-400" />
                <Users className="w-5 h-5 text-purple-400" />
                <Mail className="w-5 h-5 text-purple-400" />
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="bg-black/50 rounded-lg p-4 h-[400px] overflow-y-auto">
              {leads ? (
                <div className="whitespace-pre-wrap text-neutral-200">{leads}</div>
              ) : (
                <div className="text-neutral-400 text-center mt-8">
                  Generated leads and strategies will appear here
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadGenerator;