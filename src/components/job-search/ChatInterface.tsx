import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<string>;
  isLoading?: boolean;
}

export const ChatInterface = ({ onSendMessage, isLoading }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    try {
      const response = await onSendMessage(message);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <Card className="mt-6 p-6 bg-black/[0.96] border-white/10">
      <div className="space-y-4">
        <div className="h-[300px] overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-purple-600/20 ml-auto max-w-[80%]'
                  : 'bg-gray-800/50 mr-auto max-w-[80%]'
              }`}
            >
              <p className="text-white whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about job opportunities (e.g., 'Find remote JavaScript jobs')"
            className="flex-1 bg-black/[0.96] border-white/10 text-white"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};