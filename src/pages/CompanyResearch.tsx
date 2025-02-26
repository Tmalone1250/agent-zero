
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CompanyResearch = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [selectedReport, setSelectedReport] = useState("company-profile");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use the Company Research tool",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('company-research', {
        body: {
          companyName,
          companyUrl,
          reportType: selectedReport,
          userId: user.id,
        },
      });

      if (error) throw error;

      setResponse(data.response);
      
      // Save the research result
      await supabase.from('company_research').insert({
        user_id: user.id,
        company_name: companyName,
        company_url: companyUrl,
        report_type: selectedReport,
        report_content: data,
      });

      toast({
        title: "Success",
        description: "Company research generated successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate company research",
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

        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Company Research AI
          </h1>
          <p className="text-xl text-neutral-300">
            Get comprehensive insights into companies, markets, and industries
          </p>
        </div>

        <Card className="p-6 bg-black/50 border-white/10 mb-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select
                value={selectedReport}
                onValueChange={setSelectedReport}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company-profile">Company Profile</SelectItem>
                  <SelectItem value="financial-analysis">Financial Analysis</SelectItem>
                  <SelectItem value="market-position">Market Position</SelectItem>
                  <SelectItem value="competitor-analysis">Competitor Analysis</SelectItem>
                  <SelectItem value="industry-trends">Industry Trends</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Enter company name..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <Input
                placeholder="Company website (optional)..."
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                "Generating research..."
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Generate Research
                </>
              )}
            </Button>
          </div>
        </Card>

        {response && (
          <Card className="p-6 bg-black/50 border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Research Results</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown className="text-neutral-200">
                {response}
              </ReactMarkdown>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompanyResearch;
