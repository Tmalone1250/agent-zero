import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Image Generator Prompt:", prompt);
    // LLM integration will be added later
  };

  return (
    <div className="min-h-screen bg-black/[0.96] p-8">
      <div className="max-w-3xl mx-auto">
        <Button 
          onClick={() => navigate("/marketplace")}
          variant="ghost" 
          className="mb-8 text-white hover:text-purple-400"
        >
          ← Back to Marketplace
        </Button>

        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
          Image Generator
        </h1>
        <p className="text-xl text-neutral-300 mb-8">
          Creates custom AI images
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-lg text-white mb-2">
              Describe the image you want to create
            </label>
            <Textarea
              id="prompt"
              placeholder="Provide a detailed description of the image you want to generate..."
              className="min-h-[200px] bg-neutral-900 text-white border-neutral-700"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
          >
            Generate Image
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ImageGenerator;