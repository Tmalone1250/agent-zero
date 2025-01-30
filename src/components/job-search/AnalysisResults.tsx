import { Card } from "@/components/ui/card";

interface AnalysisResultsProps {
  analysis: string;
}

export const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  if (!analysis) return null;

  // Split the analysis into chat response and detailed analysis
  const [chatResponse, detailedAnalysis] = analysis.split('---').map(part => part.trim());

  return (
    <div className="mt-6 space-y-6">
      {detailedAnalysis && (
        <Card className="p-6 bg-black/[0.96] border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Detailed Analysis</h2>
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-white">{detailedAnalysis}</div>
          </div>
        </Card>
      )}
    </div>
  );
};