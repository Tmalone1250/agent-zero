import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateMarketAnalysis } from "@/services/gemini";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface MarketData {
  analysis: string;
  stockTrend: Array<{ date: string; price: number }>;
  marketComparison: Array<{ company: string; revenue: number }>;
  marketShare: Array<{ name: string; value: number }>;
}

const MarketAnalyst = () => {
  const [prompt, setPrompt] = useState("");
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

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
      setMarketData(response);
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

          {marketData && (
            <div className="mt-8 space-y-8">
              <div className="p-6 rounded-lg bg-black/50 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Analysis Results</h2>
                <div className="text-neutral-300 whitespace-pre-wrap">{marketData.analysis}</div>
              </div>

              {(marketData.stockTrend?.length > 0 || 
                marketData.marketComparison?.length > 0 || 
                marketData.marketShare?.length > 0) && (
                <div className="p-6 rounded-lg bg-black/50 border border-white/10">
                  <h2 className="text-xl font-semibold text-white mb-6">Market Visualizations</h2>
                  
                  <div className="space-y-8">
                    {marketData.stockTrend?.length > 0 && (
                      <div>
                        <h3 className="text-lg text-white mb-4">Stock Price Trend</h3>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer>
                            <LineChart data={marketData.stockTrend}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                              <XAxis dataKey="date" stroke="#888" />
                              <YAxis stroke="#888" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1a1a1a', 
                                  border: '1px solid #333',
                                  color: '#fff' 
                                }} 
                              />
                              <Legend />
                              <Line type="monotone" dataKey="price" stroke="#8884d8" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {marketData.marketComparison?.length > 0 && (
                      <div>
                        <h3 className="text-lg text-white mb-4">Market Revenue Comparison</h3>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer>
                            <BarChart data={marketData.marketComparison}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                              <XAxis dataKey="company" stroke="#888" />
                              <YAxis stroke="#888" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1a1a1a', 
                                  border: '1px solid #333',
                                  color: '#fff' 
                                }} 
                              />
                              <Legend />
                              <Bar dataKey="revenue" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {marketData.marketShare?.length > 0 && (
                      <div>
                        <h3 className="text-lg text-white mb-4">Market Share Distribution</h3>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer>
                            <PieChart>
                              <Pie
                                data={marketData.marketShare}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {marketData.marketShare.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1a1a1a', 
                                  border: '1px solid #333',
                                  color: '#fff' 
                                }} 
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketAnalyst;