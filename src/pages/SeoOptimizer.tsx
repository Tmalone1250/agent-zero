import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateSeoOptimization } from "@/services/gemini";
import { Loader2, Check, ArrowLeft } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link } from "react-router-dom";

const SeoOptimizer = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const prompt = `Analyze this URL for SEO: ${url}. 
      Please provide a comprehensive analysis including:
      1. Overall grade (A+, A, B, etc)
      2. On-Page SEO score
      3. Performance metrics
      4. Meta description analysis
      5. Keyword consistency
      6. Technical SEO elements`;
      
      const analysis = await generateSeoOptimization(prompt);
      setResults(analysis);
      toast({
        title: "Success",
        description: "SEO analysis completed",
      });
    } catch (error) {
      console.error("Error analyzing URL:", error);
      toast({
        title: "Error",
        description: "Failed to analyze URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderGradeCircle = (grade: string) => {
    const data = [{ value: 100 }];
    const COLORS = ['#4B9EF9'];

    return (
      <div className="relative w-32 h-32">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={35}
              outerRadius={45}
              fill="#8884d8"
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-blue-500">{grade}</span>
        </div>
      </div>
    );
  };

  const formatAnalysisText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Handle headers
      if (line.startsWith('##')) {
        return (
          <h2 key={index} className="text-xl font-bold text-white mt-4 mb-2">
            {line.replace(/##/g, '').trim()}
          </h2>
        );
      }
      // Handle subheaders with asterisks
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="text-lg font-semibold text-white/90 mt-3 mb-1">
            {line.replace(/\*\*/g, '').trim()}
          </h3>
        );
      }
      // Handle bullet points
      if (line.trim().startsWith('*')) {
        return (
          <li key={index} className="text-neutral-300 ml-4 my-1">
            {line.replace(/^\*/, '').trim()}
          </li>
        );
      }
      // Regular text
      return (
        <p key={index} className="text-neutral-400 my-1">
          {line.trim()}
        </p>
      );
    });
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

        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-8">
          SEO Analyzer
        </h1>
        
        <Card className="p-6 bg-black/[0.96] border-white/10">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-lg text-white mb-2">
                Enter website URL
              </label>
              <div className="flex gap-4">
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 bg-neutral-900 text-white border-neutral-700"
                />
                <Button
                  type="submit"
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze SEO"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {results && (
          <div className="mt-8 space-y-6">
            <Card className="p-6 bg-black/[0.96] border-white/10">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  {renderGradeCircle(results.match(/Grade: ([A-F][+-]?)/)?.[1] || "A")}
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Your page is good!
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    {formatAnalysisText(results)}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["On-Page SEO", "Links", "Performance", "Social", "Technical"].map((category) => (
                <Card key={category} className="p-6 bg-black/[0.96] border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">{category}</h3>
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-400">Score</span>
                      <span className="text-white">95/100</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoOptimizer;
