import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateDataAnalysis } from "@/services/gemini";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DataAnalyzer = () => {
  const [data, setData] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    try {
      const fileType = selectedFile.type || selectedFile.name.split('.').pop()?.toLowerCase();
      
      // Handle Excel files
      if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          fileType === 'application/vnd.ms-excel' ||
          fileType === 'application/vnd.google-apps.spreadsheet' ||
          selectedFile.name.endsWith('.xlsx') ||
          selectedFile.name.endsWith('.xls') ||
          selectedFile.name.endsWith('.gsheet')) {
        
        const buffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setData(JSON.stringify(jsonData, null, 2));
        return;
      }

      // Handle CSV, JSON, and TXT files as before
      if (fileType === "text/csv" || 
          fileType === "application/json" || 
          fileType === "text/plain") {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const content = event.target?.result as string;
          setData(content);
        };
        reader.readAsText(selectedFile);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a CSV, JSON, TXT, Excel (.xlsx, .xls), or Google Spreadsheet file",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error reading file:", error);
      toast({
        title: "Error reading file",
        description: "There was an error reading your file",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Upload file to Supabase Storage if one is selected
      let filePath = "";
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('data_analysis')
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`Error uploading file: ${uploadError.message}`);
        }
        
        filePath = fileName;
      }

      const result = await generateDataAnalysis(data);
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Your data has been analyzed successfully",
      });
    } catch (error) {
      console.error("Error analyzing data:", error);
      toast({
        title: "Error",
        description: "Failed to analyze data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.96] p-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center text-neutral-400 hover:text-white mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Data Analyzer</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="file" className="block text-lg text-white mb-2">
              Upload your data file (CSV, JSON, TXT, Excel, or Google Spreadsheet)
            </label>
            <Input
              id="file"
              type="file"
              accept=".csv,.json,.txt,.xlsx,.xls,.gsheet"
              onChange={handleFileChange}
              className="bg-neutral-900 text-white border-neutral-700"
            />
          </div>
          <div>
            <label htmlFor="data" className="block text-lg text-white mb-2">
              Or paste your data here
            </label>
            <Textarea
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="h-48 bg-neutral-900 text-white border-neutral-700"
              placeholder="Paste your data here for analysis..."
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isLoading || !data.trim()}
          >
            {isLoading ? "Analyzing..." : "Analyze Data"}
          </Button>
        </form>

        {analysis && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Analysis Results</h2>
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700">
              <pre className="text-white whitespace-pre-wrap">{analysis}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataAnalyzer;
