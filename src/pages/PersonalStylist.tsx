
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PersonalStylist = () => {
  const [userInput, setUserInput] = useState("");
  const [selectedService, setSelectedService] = useState("fashion-advice");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('wardrobe')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('wardrobe')
        .getPublicUrl(fileName);

      await supabase.from('wardrobe_items').insert({
        user_id: user.id,
        image_url: publicUrl,
        category: 'uncategorized',
      });

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter your fashion question or upload an image",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use the Personal Stylist",
          variant: "destructive",
        });
        return;
      }

      const { data: preferences } = await supabase
        .from('style_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .single();

      const { data, error } = await supabase.functions.invoke('personal-stylist', {
        body: {
          prompt: userInput,
          service: selectedService,
          userId: user.id,
          preferences: preferences?.preferences || {},
        },
      });

      if (error) throw error;

      setResponse(data.response);
      toast({
        title: "Success",
        description: "Styling advice generated successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate styling advice",
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
          to="/dashboard"
          className="inline-flex items-center text-neutral-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Personal Stylist AI
          </h1>
          <p className="text-xl text-neutral-300">
            Your AI fashion advisor for personalized style recommendations
          </p>
        </div>

        <Card className="p-6 bg-black/50 border-white/10 mb-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fashion-advice">Fashion Advice</SelectItem>
                  <SelectItem value="outfit-recommendations">Outfit Ideas</SelectItem>
                  <SelectItem value="wardrobe-analysis">Wardrobe Analysis</SelectItem>
                  <SelectItem value="trend-analysis">Trend Analysis</SelectItem>
                  <SelectItem value="shopping-assistance">Shopping Help</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => document.getElementById('imageUpload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <input
                id="imageUpload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <Textarea
              placeholder="Ask for fashion advice, outfit recommendations, or wardrobe suggestions..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-[100px]"
            />

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                "Generating recommendations..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Get Styling Advice
                </>
              )}
            </Button>
          </div>
        </Card>

        {response && (
          <Card className="p-6 bg-black/50 border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Recommendations</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown className="text-neutral-200">
                {response}
              </ReactMarkdown>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PersonalStylist;
