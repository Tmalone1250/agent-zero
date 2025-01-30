import { Card } from "@/components/ui/card";

interface AnalysisResultsProps {
  analysis: string;
}

export const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  if (!analysis) return null;

  return (
    <Card className="mt-6 p-6 bg-black/[0.96] border-white/10">
      <h2 className="text-2xl font-semibold text-white mb-4">Analysis Results</h2>
      <div className="prose prose-invert max-w-none">
        <pre className="whitespace-pre-wrap text-white">{analysis}</pre>
      </div>
    </Card>
  );
};