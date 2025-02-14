
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Copy, Download, FileSearch, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseDocument } from "@/utils/documentParser";

const databases = [
  { value: "academic", label: "Academic Papers" },
  { value: "web", label: "Web Content" },
  { value: "all", label: "All Sources" }
];

const sensitivities = [
  { value: "strict", label: "Strict" },
  { value: "moderate", label: "Moderate" },
  { value: "lenient", label: "Lenient" }
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" }
];

interface PlagiarismResult {
  score: number;
  matches: Array<{
    text: string;
    source: string;
    similarity: number;
  }>;
}

const PlagiarismChecker = () => {
  const [inputText, setInputText] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState("all");
  const [selectedSensitivity, setSelectedSensitivity] = useState("moderate");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await parseDocument(file);
      setInputText(text);
      toast({
        title: "File uploaded",
        description: "Text has been loaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckPlagiarism = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to check",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Here we'll integrate with Gemini API to check plagiarism
      const response = await fetch("https://api.gemini.ai/v1/plagiarism-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          database: selectedDatabase,
          sensitivity: selectedSensitivity,
          language: selectedLanguage,
        }),
      });

      const data = await response.json();
      setResult(data);

      toast({
        title: "Success",
        description: "Plagiarism check completed",
      });
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      toast({
        title: "Error",
        description: "Failed to check plagiarism. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;

    try {
      const reportText = `
        Plagiarism Report
        Overall Similarity Score: ${result.score}%
        
        Matches Found:
        ${result.matches.map(match => `
        - Match (${match.similarity}% similar):
          "${match.text}"
          Source: ${match.source}
        `).join('\n')}
      `;

      await navigator.clipboard.writeText(reportText);
      toast({
        title: "Copied",
        description: "Report copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy report",
        variant: "destructive",
      });
    }
  };

  const downloadReport = () => {
    if (!result) return;

    const reportText = `
      Plagiarism Report
      Generated: ${new Date().toLocaleString()}
      
      Overall Similarity Score: ${result.score}%
      
      Detailed Matches:
      ${result.matches.map(match => `
      Match (${match.similarity}% similar):
      Text: "${match.text}"
      Source: ${match.source}
      `).join('\n')}
    `;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plagiarism-report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Plagiarism Checker
          </h1>
          <p className="text-xl text-neutral-300">
            Scan text for plagiarism and get detailed similarity reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-black/50 border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Input</h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.docx,.pdf"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>

              <Textarea
                placeholder="Enter your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="h-48 bg-black/50 border-white/10 text-white"
              />

              <div className="grid grid-cols-3 gap-4">
                <Select
                  value={selectedDatabase}
                  onValueChange={setSelectedDatabase}
                >
                  <SelectTrigger className="bg-black/50 border-white/10 text-white">
                    <SelectValue placeholder="Select database" />
                  </SelectTrigger>
                  <SelectContent>
                    {databases.map((db) => (
                      <SelectItem key={db.value} value={db.value}>
                        {db.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedSensitivity}
                  onValueChange={setSelectedSensitivity}
                >
                  <SelectTrigger className="bg-black/50 border-white/10 text-white">
                    <SelectValue placeholder="Select sensitivity" />
                  </SelectTrigger>
                  <SelectContent>
                    {sensitivities.map((sensitivity) => (
                      <SelectItem key={sensitivity.value} value={sensitivity.value}>
                        {sensitivity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="bg-black/50 border-white/10 text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCheckPlagiarism}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? "Checking..." : "Check Plagiarism"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-black/50 border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Results</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  disabled={!result}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={downloadReport}
                  disabled={!result}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="text-center p-6 bg-black/30 rounded-lg">
                  <div className="text-2xl font-bold text-white mb-2">
                    Similarity Score
                  </div>
                  <Progress value={result.score} className="mb-2" />
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    {result.score}%
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Matched Sources
                  </h3>
                  {result.matches.map((match, index) => (
                    <div key={index} className="p-4 bg-black/30 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-400">
                          {match.similarity}% Match
                        </span>
                        <a
                          href={match.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View Source
                        </a>
                      </div>
                      <p className="text-neutral-300">"{match.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-neutral-500 text-center p-8">
                Check your text to see plagiarism results here
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlagiarismChecker;
