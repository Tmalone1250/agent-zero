import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DocumentFormatter = () => {
  const [mainDocument, setMainDocument] = useState<File | null>(null);
  const [referenceDocument, setReferenceDocument] = useState<File | null>(null);
  const [useReference, setUseReference] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleMainDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || 
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setMainDocument(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive",
        });
      }
    }
  };

  const handleReferenceDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || 
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setReferenceDocument(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainDocument) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('mainDocument', mainDocument);
      if (useReference && referenceDocument) {
        formData.append('referenceDocument', referenceDocument);
      }

      const response = await fetch('/api/format-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to format document');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `formatted_${mainDocument.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Document formatted successfully!",
      });
    } catch (error) {
      console.error('Error formatting document:', error);
      toast({
        title: "Error",
        description: "Failed to format document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
        <h1 className="text-4xl font-bold text-white mb-8">Document Formatter</h1>
        
        <Card className="p-6 bg-neutral-900 border-neutral-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="mainDocument" className="text-lg text-white mb-2">
                Upload Document
              </Label>
              <Input
                id="mainDocument"
                type="file"
                accept=".pdf,.docx"
                onChange={handleMainDocumentUpload}
                className="bg-neutral-800 text-white border-neutral-700"
              />
              <p className="text-sm text-neutral-400 mt-1">
                Supported formats: PDF, DOCX
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="useReference"
                checked={useReference}
                onCheckedChange={setUseReference}
              />
              <Label htmlFor="useReference" className="text-white">
                Use reference document for styling
              </Label>
            </div>

            {useReference && (
              <div>
                <Label htmlFor="referenceDocument" className="text-lg text-white mb-2">
                  Upload Reference Document
                </Label>
                <Input
                  id="referenceDocument"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleReferenceDocumentUpload}
                  className="bg-neutral-800 text-white border-neutral-700"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isProcessing || !mainDocument}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <span className="loader mr-2"></span>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Format Document
                </div>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DocumentFormatter;