import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            <CardContent className="p-6">
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
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hiredAgents.map((agent) => (
              <Card key={agent.id} className="bg-black/[0.96] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">{agent.agent_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-neutral-300">{agent.agent_description}</p>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => navigate(agent.agent_path)}
                  >
                    Open Agent
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAgents;