import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Code, Image, MessageSquare, Database, Network, Bot, Activity, Globe, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const agents = [
  {
    icon: <Code className="w-12 h-12 text-purple-400" />,
    name: "Code Assistant",
    description: "Expert code optimization specialist",
    path: "/code-assistant"
  },
  {
    icon: <Image className="w-12 h-12 text-primary" />,
    name: "Image Generator",
    description: "Creates custom AI images",
    path: "/image-generator"
  },
  {
    icon: <MessageSquare className="w-12 h-12 text-primary" />,
    name: "Content Writer",
    description: "Writes engaging content fast",
    path: "/content-writer"
  },
  {
    icon: <Database className="w-12 h-12 text-primary" />,
    name: "Data Analyzer",
    description: "Processes data for insights",
    path: "/data-analyzer"
  },
  {
    icon: <Network className="w-12 h-12 text-primary" />,
    name: "SEO Optimizer",
    description: "Improves search rankings quickly"
  },
  {
    icon: <Bot className="w-12 h-12 text-primary" />,
    name: "Customer Service Bot",
    description: "24/7 customer support assistant"
  },
  {
    icon: <Activity className="w-12 h-12 text-primary" />,
    name: "Market Analyst",
    description: "Analyzes market trends expertly"
  },
  {
    icon: <Globe className="w-12 h-12 text-primary" />,
    name: "Translation Expert",
    description: "Translates multiple languages instantly"
  },
  {
    icon: <Search className="w-12 h-12 text-primary" />,
    name: "Research Assistant",
    description: "Fast comprehensive research helper"
  },
  {
    icon: <Target className="w-12 h-12 text-primary" />,
    name: "Lead Generator",
    description: "Identifies qualified business leads"
  }
];

const Marketplace = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black/[0.96] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            AI Agents
          </h1>
          <p className="text-2xl md:text-4xl bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Digital Workforce
          </p>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Hire specialized AI agents to handle your tasks. From data analysis to creative work,
            our agents are ready to join your team and amplify your capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-black/[0.96] border-white/10"
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-900/50 to-pink-900/50 mb-4 mx-auto">
                  {agent.icon}
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-2">{agent.name}</h3>
                <p className="text-neutral-300 text-center mb-4">{agent.description}</p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  onClick={() => agent.path && navigate(agent.path)}
                >
                  Hire
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;