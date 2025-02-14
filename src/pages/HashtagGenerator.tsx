import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Copy, Hash, TrendingUp, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { parseDocument } from "@/utils/documentParser";

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "all", label: "All Platforms" }
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" }
];

const lengths = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" }
];

interface HashtagResult {
  hashtags: string[];
  trending: string[];
  categories: {
    [key: string]: string[];
  };
}

const HashtagGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedLength, setSelectedLength] = useState("medium");
  const [numHashtags, setNumHashtags] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HashtagResult | null>(null);
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
        description: "Content has been loaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateHashtags = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text or upload content",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to use this feature",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("https://api.gemini.ai/v1/generate-hashtags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          platform: selectedPlatform,
          language: selectedLanguage,
          length: selectedLength,
          count: numHashtags,
        }),
      });

      const data = await response.json();

      await supabase.from("hashtag_generations").insert({
        user_id: user.id,
        input_text: inputText,
        platform: selectedPlatform,
        language: selectedLanguage,
        length_preference: selectedLength,
        num_hashtags: numHashtags,
        generated_hashtags: data,
      });

      setResult(data);
      toast({
        title: "Success",
        description: "Hashtags generated successfully",
      });
    } catch (error) {
      console.error("Error generating hashtags:", error);
      toast({
        title: "Error",
        description: "Failed to generate hashtags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (hashtags: string[]) => {
    try {
      await navigator.clipboard.writeText(hashtags.join(" "));
      toast({
        title: "Copied",
        description: "Hashtags copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy hashtags",
        variant: "destructive",
      });
    }
  };

  const downloadHashtags = (hashtags: string[]) => {
    const content = hashtags.join(" \n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hashtags.txt";
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
            Hashtag Generator
          </h1>
          <p className="text-xl text-neutral-300">
            Generate trending hashtags for your social media content
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
                  Upload Content
                </Button>
              </div>

              <Textarea
                placeholder="Enter your content here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="h-40 bg-black/50 border-white/10 text-white"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={selectedPlatform}
                  onValueChange={setSelectedPlatform}
                >
                  <SelectTrigger className="bg-black/50 border-white/10 text-white">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
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

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Number of hashtags: {numHashtags}</span>
                  <span>Max: 50</span>
                </div>
                <Slider
                  value={[numHashtags]}
                  onValueChange={(value) => setNumHashtags(value[0])}
                  max={50}
                  min={1}
                  step={1}
                />
              </div>

              <Select
                value={selectedLength}
                onValueChange={setSelectedLength}
              >
                <SelectTrigger className="bg-black/50 border-white/10 text-white">
                  <SelectValue placeholder="Select hashtag length" />
                </SelectTrigger>
                <SelectContent>
                  {lengths.map((length) => (
                    <SelectItem key={length.value} value={length.value}>
                      {length.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleGenerateHashtags}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? "Generating..." : "Generate Hashtags"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-black/50 border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Generated Hashtags</h2>
              {result && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.hashtags)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>
                </div>
              )}
            </div>

            {result ? (
              <Tabs defaultValue="all">
                <TabsList className="bg-black/50">
                  <TabsTrigger value="all">All Hashtags</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((hashtag, index) => (
                      <Badge
                        key={index}
                        className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 cursor-pointer"
                        onClick={() => copyToClipboard([hashtag])}
                      >
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="trending" className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {result.trending.map((hashtag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 cursor-pointer"
                        onClick={() => copyToClipboard([hashtag])}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                  {Object.entries(result.categories).map(([category, hashtags]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-sm font-medium text-neutral-400">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((hashtag, index) => (
                          <Badge
                            key={index}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 cursor-pointer"
                            onClick={() => copyToClipboard([hashtag])}
                          >
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center p-8 text-neutral-500">
                <Hash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Generate hashtags to see them here</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HashtagGenerator;
