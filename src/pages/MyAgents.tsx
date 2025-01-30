import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);

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

  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;

    const { error } = await supabase
      .from('hired_agents')
      .delete()
      .eq('id', agentToDelete);

    if (error) {
      console.error('Error deleting agent:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the agent. Please try again.",
      });
    } else {
      setHiredAgents(hiredAgents.filter(agent => agent.id !== agentToDelete));
      toast({
        title: "Success",
        description: "Agent successfully deleted.",
      });
    }
    setAgentToDelete(null);
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
                className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-black/[0.96] border-white/10"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-neutral-400 hover:text-white hover:bg-red-500/20"
                  onClick={() => setAgentToDelete(agent.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
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

        <AlertDialog open={!!agentToDelete} onOpenChange={() => setAgentToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this Agent?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={handleDeleteAgent}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MyAgents;