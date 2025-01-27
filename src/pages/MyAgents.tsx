import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HiredAgent {
  id: string;
  agent_name: string;
  agent_description: string;
  agent_path: string;
}

const MyAgents = () => {
  const navigate = useNavigate();
  const [hiredAgents, setHiredAgents] = useState<HiredAgent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHiredAgents = async () => {
      const { data: agents, error } = await supabase
        .from('hired_agents')
        .select('*');

      if (error) {
        console.error('Error fetching hired agents:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your agents. Please try again.",
        });
      } else {
        setHiredAgents(agents || []);
      }
    };

    fetchHiredAgents();
  }, [toast]);

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

        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-8">
          My Agents
        </h1>

        {hiredAgents.length === 0 ? (
          <Card className="bg-black/[0.96] border-white/10">
            <div className="p-6">
              <div className="text-center py-4">
                <p className="text-neutral-300 mb-4">
                  You haven't hired any agents yet
                </p>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => navigate('/marketplace')}
                >
                  Browse Marketplace
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hiredAgents.map((agent) => (
              <Card 
                key={agent.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-black/[0.96] border-white/10"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-900/50 to-pink-900/50 mb-4 mx-auto">
                    <Bot className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white text-center mb-2">
                    {agent.agent_name}
                  </h3>
                  <p className="text-neutral-300 text-center mb-4">
                    {agent.agent_description}
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() => navigate(agent.agent_path)}
                  >
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAgents;