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
  onSendMessage: (message: string) => void;
}

export const ChatInterface = ({ onSendMessage }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: message
    };

    setMessages([...messages, newMessage]);
    onSendMessage(message);
    setMessage('');
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
              <p className="text-white">{msg.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your request (e.g., 'Find remote JavaScript jobs')"
            className="flex-1 bg-black/[0.96] border-white/10 text-white"
          />
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};