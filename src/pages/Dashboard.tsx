import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HiredAgent {
  id: string;
  agent_name: string;
  agent_description: string;
  agent_path: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [hiredAgents, setHiredAgents] = useState<HiredAgent[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }

      const { data: agents, error } = await supabase
        .from('hired_agents')
        .select('*');

      if (error) {
        console.error('Error fetching hired agents:', error);
      } else {
        setHiredAgents(agents || []);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.96] p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-black/[0.96] border-white/10">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Profile</CardTitle>
                  <CardDescription className="text-neutral-400">
                    {userEmail}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-300">
                View and manage your profile settings
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => navigate('/profile')}
              >
                View Profile
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/10 text-black hover:text-white hover:bg-white/5"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Marketplace Card */}
          <Card className="bg-black/[0.96] border-white/10">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                  <Store className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white">AI Agent Marketplace</CardTitle>
                  <CardDescription className="text-neutral-400">
                    Discover and hire AI agents
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-300 mb-4">
                Browse our collection of specialized AI agents ready to help with your tasks
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => navigate('/marketplace')}
              >
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>

          {/* Agents Card */}
          <Card className="bg-black/[0.96] border-white/10">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white">My Agents</CardTitle>
                  <CardDescription className="text-neutral-400">
                    {hiredAgents.length} Agent{hiredAgents.length !== 1 ? 's' : ''} Hired
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hiredAgents.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-neutral-300 mb-4">
                    You haven't hired any agents yet
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => navigate('/marketplace')}
                  >
                    View My Agents
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => navigate('/my-agents')}
                  >
                    View My Agents
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;