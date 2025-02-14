
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Copy, Download, SpellCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { parseDocument } from "@/utils/documentParser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" }
];

const tones = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "academic", label: "Academic" }
];

const GrammarChecker = () => {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedTone, setSelectedTone] = useState("formal");
  const [isLoading, setIsLoading] = useState(false);
  const [corrections, setCorrections] = useState<Array<{ error: string; suggestion: string; explanation: string }>>([]);
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

  const handleCheckGrammar = async () => {
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
      // Here we'll integrate with Gemini API to check grammar
      const prompt = `Please check the following text for grammar, spelling, and punctuation errors. 
      Provide corrections and explanations. Use ${selectedTone} tone and check according to ${selectedLanguage} language rules:

      ${inputText}`;

      // Use the existing Gemini integration
      const response = await fetch("https://api.gemini.ai/v1/grammar-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          language: selectedLanguage,
          tone: selectedTone,
        }),
      });

      const data = await response.json();
      setCorrectedText(data.correctedText);
      setCorrections(data.corrections);

      toast({
        title: "Success",
        description: "Grammar check completed",
      });
    } catch (error) {
      console.error("Error checking grammar:", error);
      toast({
        title: "Error",
        description: "Failed to check grammar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(correctedText);
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const downloadText = () => {
    const blob = new Blob([correctedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "corrected-text.txt";
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
            Grammar Checker
          </h1>
          <p className="text-xl text-neutral-300">
            Check and correct grammar, spelling, and punctuation
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

              <div className="grid grid-cols-2 gap-4">
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

                <Select
                  value={selectedTone}
                  onValueChange={setSelectedTone}
                >
                  <SelectTrigger className="bg-black/50 border-white/10 text-white">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCheckGrammar}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? "Checking..." : "Check Grammar"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-black/50 border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Output</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  disabled={!correctedText}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={downloadText}
                  disabled={!correctedText}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="corrected">
              <TabsList className="bg-black/50">
                <TabsTrigger value="corrected">Corrected Text</TabsTrigger>
                <TabsTrigger value="corrections">Corrections</TabsTrigger>
              </TabsList>

              <TabsContent value="corrected">
                {correctedText ? (
                  <div className="prose prose-invert">
                    <div className="whitespace-pre-wrap text-neutral-300">
                      {correctedText}
                    </div>
                  </div>
                ) : (
                  <div className="text-neutral-500 text-center p-8">
                    Check your text to see corrections here
                  </div>
                )}
              </TabsContent>

              <TabsContent value="corrections">
                {corrections.length > 0 ? (
                  <div className="space-y-4">
                    {corrections.map((correction, index) => (
                      <div key={index} className="p-4 bg-black/30 rounded-lg">
                        <p className="text-red-400">Error: {correction.error}</p>
                        <p className="text-green-400">Suggestion: {correction.suggestion}</p>
                        <p className="text-neutral-400 text-sm">{correction.explanation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-neutral-500 text-center p-8">
                    No corrections to display
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GrammarChecker;
