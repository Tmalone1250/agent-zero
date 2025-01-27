import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateMarketAnalysis } from "@/services/gemini";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface MarketAnalysis {
  summary: string;
  marketSize: {
    current: number;
    projected: number;
    growthRate: number;
  };
  keyTrends: string[];
  competitorData: Array<{ name: string; marketShare: number }>;
  monthlyGrowth: Array<{ month: string; growth: number }>;
  recommendations: string[];
}

const MarketAnalyst = () => {
  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
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
      <div className="max-w-6xl mx-auto">
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
            <div className="mt-8 space-y-8">
              <div className="p-6 rounded-lg bg-black/50 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Analysis Summary</h2>
                <div className="text-neutral-300">{analysis.summary}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Market Size Comparison */}
                <div className="p-6 rounded-lg bg-black/50 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Market Size Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { name: 'Current', value: analysis.marketSize.current },
                        { name: 'Projected', value: analysis.marketSize.projected }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Competitor Market Share */}
                <div className="p-6 rounded-lg bg-black/50 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Competitor Market Share</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analysis.competitorData}
                        dataKey="marketShare"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {analysis.competitorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly Growth Trend */}
                <div className="p-6 rounded-lg bg-black/50 border border-white/10 md:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-4">Monthly Growth Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={analysis.monthlyGrowth}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="growth" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-lg bg-black/50 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Trends</h3>
                  <ul className="list-disc list-inside text-neutral-300 space-y-2">
                    {analysis.keyTrends.map((trend, index) => (
                      <li key={index}>{trend}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-lg bg-black/50 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
                  <ul className="list-disc list-inside text-neutral-300 space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketAnalyst;