
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Code, Image, MessageSquare, Database, Network, Bot, Activity, Globe, Target, ArrowLeft, GraduationCap, Quote, SpellCheck, FileSearch, Hash, ScrollText, Briefcase, Shirt, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const agents = [
  {
    icon: <Building2 className="w-12 h-12 text-purple-400" />,
    name: "Company Research",
    description: "Comprehensive company and market analysis",
    path: "/company-research"
  },
  {
    icon: <Shirt className="w-12 h-12 text-purple-400" />,
    name: "Personal Stylist",
    description: "AI-powered fashion advice and outfit recommendations",
    path: "/personal-stylist"
  },
  {
    icon: <ScrollText className="w-12 h-12 text-purple-400" />,
    name: "Resume Builder",
    description: "Create professional resumes with AI guidance",
    path: "/resume-builder"
  },
  {
    icon: <Hash className="w-12 h-12 text-purple-400" />,
    name: "Hashtag Generator",
    description: "Generate trending hashtags for your content",
    path: "/hashtag-generator"
  },
  {
    icon: <FileSearch className="w-12 h-12 text-purple-400" />,
    name: "Plagiarism Checker",
    description: "Scan text for plagiarism with detailed reports",
    path: "/plagiarism-checker"
  },
  {
    icon: <SpellCheck className="w-12 h-12 text-purple-400" />,
    name: "Grammar Checker",
    description: "Check and correct grammar, spelling, and punctuation",
    path: "/grammar-checker"
  },
  {
    icon: <Quote className="w-12 h-12 text-purple-400" />,
    name: "Testimonial Transformer",
    description: "Transform testimonials into multiple content formats",
    path: "/testimonial-transformer"
  },
  {
    icon: <FileText className="w-12 h-12 text-primary" />,
    name: "Document Formatter",
    description: "Professional document formatting and styling",
    path: "/document-formatter"
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
    description: "Improves search rankings quickly",
    path: "/seo-optimizer"
  },
  {
    icon: <Bot className="w-12 h-12 text-primary" />,
    name: "Customer Service Bot",
    description: "24/7 customer support assistant",
    path: "/customer-service-bot"
  },
  {
    icon: <Activity className="w-12 h-12 text-primary" />,
    name: "Market Analyst",
    description: "Analyzes market trends expertly",
    path: "/market-analyst"
  },
  {
    icon: <Globe className="w-12 h-12 text-primary" />,
    name: "Translation Expert",
    description: "Translates multiple languages instantly",
    path: "/translation-expert"
  },
  {
    icon: <Target className="w-12 h-12 text-primary" />,
    name: "Research Assistant",
    description: "Fast comprehensive research helper",
    path: "/research-assistant"
  },
  {
    icon: <GraduationCap className="w-12 h-12 text-primary" />,
    name: "Academic Assistant",
    description: "Personalized learning support",
    path: "/academic-assistant"
  }
];

const Marketplace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleHireAgent = async (agent: typeof agents[0]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to hire agents",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('hired_agents')
        .insert({
          user_id: user.id,
          agent_name: agent.name,
          agent_description: agent.description,
          agent_path: agent.path
        });

      if (error) {
        console.error('Error hiring agent:', error);
        toast({
          title: "Error",
          description: "Failed to hire agent. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `${agent.name} has been hired successfully!`
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.96] p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-white hover:text-white/80"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

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
                  onClick={() => handleHireAgent(agent)}
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
