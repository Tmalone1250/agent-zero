
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateCustomerServiceResponse } from "@/services/gemini";

const CustomerServiceBot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateCustomerServiceResponse(message);
      setResponse(result);
      toast({
        title: "Success",
        description: "Response generated successfully",
      });
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
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

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Customer Service Bot
          </h1>
          <p className="text-lg text-neutral-300">
            Get professional customer service responses.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Textarea
              placeholder="Enter customer message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-32 bg-black/50 border-white/10 text-white"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              "Generating..."
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Generate Response
              </>
            )}
          </Button>

          {response && (
            <div className="mt-8">
              <div className="p-6 rounded-lg bg-black/50 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Response</h2>
                <div className="text-neutral-300 whitespace-pre-wrap">{response}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceBot;
