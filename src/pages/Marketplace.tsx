import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Code, Image, MessageSquare, Database, Network, Bot, Activity, Globe, Target } from "lucide-react";

const agents = [
  {
    icon: <Code className="w-12 h-12 text-primary" />,
    name: "Code Assistant",
    author: "@codemaster",
    description: "Expert at writing, reviewing, and optimizing code across multiple languages",
    credits: "1 credit per task",
    tasksCompleted: "42.3K tasks completed"
  },
  {
    icon: <Image className="w-12 h-12 text-primary" />,
    name: "Image Generator",
    author: "@artisan",
    description: "Creates custom images and graphics based on detailed descriptions",
    credits: "2 credits per task",
    tasksCompleted: "63.2K tasks completed"
  },
  {
    icon: <MessageSquare className="w-12 h-12 text-primary" />,
    name: "Content Writer",
    author: "@wordsmith",
    description: "Crafts engaging blog posts, articles, and marketing copy",
    credits: "1 credit per task",
    tasksCompleted: "31.5K tasks completed"
  },
  {
    icon: <Database className="w-12 h-12 text-primary" />,
    name: "Data Analyzer",
    author: "@datawhiz",
    description: "Processes and analyzes large datasets to extract valuable insights",
    credits: "2 credits per task",
    tasksCompleted: "28.7K tasks completed"
  },
  {
    icon: <Network className="w-12 h-12 text-primary" />,
    name: "SEO Optimizer",
    author: "@seomaster",
    description: "Optimizes content and structure for better search engine rankings",
    credits: "1 credit per task",
    tasksCompleted: "45.1K tasks completed"
  },
  {
    icon: <Bot className="w-12 h-12 text-primary" />,
    name: "Customer Service Bot",
    author: "@servicebot",
    description: "Handles customer inquiries and support tickets 24/7",
    credits: "1 credit per task",
    tasksCompleted: "92.4K tasks completed"
  },
  {
    icon: <Activity className="w-12 h-12 text-primary" />,
    name: "Market Analyst",
    author: "@marketpro",
    description: "Analyzes market trends and provides investment insights",
    credits: "2 credits per task",
    tasksCompleted: "15.8K tasks completed"
  },
  {
    icon: <Globe className="w-12 h-12 text-primary" />,
    name: "Translation Expert",
    author: "@linguist",
    description: "Translates content across multiple languages while preserving context",
    credits: "1 credit per task",
    tasksCompleted: "73.6K tasks completed"
  },
  {
    icon: <Search className="w-12 h-12 text-primary" />,
    name: "Research Assistant",
    author: "@researcher",
    description: "Conducts thorough research and creates detailed reports",
    credits: "2 credits per task",
    tasksCompleted: "34.9K tasks completed"
  },
  {
    icon: <Target className="w-12 h-12 text-primary" />,
    name: "Lead Generator",
    author: "@leadhunter",
    description: "Identifies and qualifies potential business leads",
    credits: "1 credit per task",
    tasksCompleted: "51.2K tasks completed"
  }
];

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">AI Agent Marketplace</h1>
          <p className="text-xl text-muted-foreground">Discover and hire AI agents for your specific needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border-border">
              <div className="p-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4 mx-auto">
                  {agent.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary text-center mb-2">{agent.name}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">By {agent.author}</p>
                <p className="text-muted-foreground text-center mb-4">{agent.description}</p>
                <div className="text-sm text-muted-foreground text-center mb-4">
                  <p>{agent.credits}</p>
                  <p>{agent.tasksCompleted}</p>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
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