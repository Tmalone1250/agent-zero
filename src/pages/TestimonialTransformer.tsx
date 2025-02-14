
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Quote, FileText, PresentationIcon, Mail, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const outputTypes = [
  { id: "social", label: "Social Proof", icon: <Quote className="w-4 h-4" /> },
  { id: "case-study", label: "Case Study", icon: <FileText className="w-4 h-4" /> },
  { id: "sales-deck", label: "Sales Deck", icon: <PresentationIcon className="w-4 h-4" /> },
  { id: "email", label: "Email Campaign", icon: <Mail className="w-4 h-4" /> },
  { id: "blog", label: "Blog Post", icon: <BookOpen className="w-4 h-4" /> }
];

const TestimonialTransformer = () => {
  const [testimonial, setTestimonial] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [customerRole, setCustomerRole] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [outputType, setOutputType] = useState("social");
  const [isLoading, setIsLoading] = useState(false);
  const [transformedContent, setTransformedContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, we'll just handle text files
    if (file.type === "text/plain") {
      const text = await file.text();
      setTestimonial(text);
      toast({
        title: "File uploaded",
        description: "Testimonial text has been loaded successfully.",
      });
    } else {
      toast({
        title: "Unsupported file type",
        description: "Please upload a text file.",
        variant: "destructive",
      });
    }
  };

  const handleTransform = async () => {
    if (!testimonial.trim()) {
      toast({
        title: "Error",
        description: "Please enter a testimonial",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Construct the prompt based on the selected output type and tone
      const prompt = `Transform this testimonial into a ${outputType} format with a ${selectedTone} tone.
        
        Testimonial: "${testimonial}"
        Customer: ${customerName}
        Company: ${companyName}
        Role: ${customerRole}

        Please provide the content in the appropriate format for ${outputType}, maintaining professionalism and highlighting key benefits and outcomes.`;

      // Use the Gemini API to transform the content
      const response = await fetch("https://api.gemini.ai/v1/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          outputType,
          tone: selectedTone,
        }),
      });

      const data = await response.json();
      setTransformedContent(data.content);

      toast({
        title: "Success",
        description: "Content transformed successfully",
      });
    } catch (error) {
      console.error("Error transforming content:", error);
      toast({
        title: "Error",
        description: "Failed to transform content. Please try again.",
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
          to="/dashboard"
          className="inline-flex items-center text-neutral-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Testimonial Transformer
          </h1>
          <p className="text-xl text-neutral-300">
            Transform customer testimonials into various content formats
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 bg-black/50 border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Input</h2>
            
            <div className="space-y-4">
              <div>
                <Input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Testimonial
                </Button>
              </div>

              <Textarea
                placeholder="Enter your testimonial here..."
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                className="h-32 bg-black/50 border-white/10 text-white"
              />

              <Input
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-black/50 border-white/10 text-white"
              />

              <Input
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-black/50 border-white/10 text-white"
              />

              <Input
                placeholder="Customer Role"
                value={customerRole}
                onChange={(e) => setCustomerRole(e.target.value)}
                className="bg-black/50 border-white/10 text-white"
              />

              <Select
                value={selectedTone}
                onValueChange={setSelectedTone}
              >
                <SelectTrigger className="bg-black/50 border-white/10 text-white">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                </SelectContent>
              </Select>

              <Tabs defaultValue="social" onValueChange={setOutputType}>
                <TabsList className="grid grid-cols-5 bg-black/50">
                  {outputTypes.map((type) => (
                    <TabsTrigger
                      key={type.id}
                      value={type.id}
                      className="flex items-center gap-2"
                    >
                      {type.icon}
                      <span className="hidden md:inline">{type.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <Button
                onClick={handleTransform}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? "Transforming..." : "Transform Content"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-black/50 border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Output</h2>
            {transformedContent ? (
              <div className="prose prose-invert">
                <div className="whitespace-pre-wrap text-neutral-300">
                  {transformedContent}
                </div>
              </div>
            ) : (
              <div className="text-neutral-500 text-center p-8">
                Transform your testimonial to see the output here
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestimonialTransformer;
