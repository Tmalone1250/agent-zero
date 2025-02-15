
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GamepadIcon, Trophy, Users, Timer, Target, ArrowLeft, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Match {
  id: string;
  game_type: string;
  tournament: string;
  team1: string;
  team2: string;
  start_time: string;
  status: string;
  score_team1: number | null;
  score_team2: number | null;
  odds_team1: number | null;
  odds_team2: number | null;
}

interface UserPreferences {
  favorite_games: string[];
  favorite_teams: string[];
  risk_level: string;
  notification_preferences: {
    match_start: boolean;
    predictions: boolean;
  };
}

const EsportsBetting = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPreferences();
    fetchMatches();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to use the Esports Betting Advisor",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('esports_user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching preferences:', error);
        return;
      }

      setPreferences(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('esports_matches')
        .select('*')
        .order('start_time', { ascending: true })
        .limit(10);

      if (error) {
        throw error;
      }

      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        title: "Error",
        description: "Failed to fetch matches. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGameChange = (value: string) => {
    setSelectedGame(value);
    // You would typically fetch new matches here based on the selected game
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateWinProbability = (odds1: number | null, odds2: number | null) => {
    if (!odds1 || !odds2) return "N/A";
    const total = odds1 + odds2;
    return `${Math.round((odds1 / total) * 100)}%`;
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

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-2">
              Esports Betting Advisor
            </h1>
            <p className="text-neutral-400">
              Get AI-powered predictions and insights for esports matches
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Enable Notifications
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-4 bg-black/[0.96] border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-400 block mb-2">
                    Game
                  </label>
                  <Select value={selectedGame} onValueChange={handleGameChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select game" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Games</SelectItem>
                      <SelectItem value="lol">League of Legends</SelectItem>
                      <SelectItem value="dota2">Dota 2</SelectItem>
                      <SelectItem value="csgo">CS:GO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="live" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/[0.96] border-white/10">
                <TabsTrigger value="live">Live Matches</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="predictions">My Predictions</TabsTrigger>
              </TabsList>

              <TabsContent value="live" className="mt-4">
                <div className="space-y-4">
                  {loading ? (
                    <Card className="p-6 bg-black/[0.96] border-white/10">
                      <p className="text-neutral-400">Loading matches...</p>
                    </Card>
                  ) : matches.length === 0 ? (
                    <Card className="p-6 bg-black/[0.96] border-white/10">
                      <p className="text-neutral-400">No live matches available</p>
                    </Card>
                  ) : (
                    matches.map((match) => (
                      <Card key={match.id} className="p-6 bg-black/[0.96] border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Trophy className="h-4 w-4 text-purple-400" />
                              <span className="text-sm text-neutral-400">{match.tournament}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <div className="text-lg font-semibold text-white">{match.team1}</div>
                              <div className="text-neutral-400">vs</div>
                              <div className="text-lg font-semibold text-white">{match.team2}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <Timer className="h-4 w-4 text-neutral-400" />
                              <span className="text-sm text-neutral-400">
                                {formatDate(match.start_time)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-green-400" />
                              <span className="text-sm text-green-400">
                                Win probability: {calculateWinProbability(match.odds_team1, match.odds_team2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="mt-4">
                <Card className="p-6 bg-black/[0.96] border-white/10">
                  <p className="text-neutral-400">Coming soon: Upcoming matches</p>
                </Card>
              </TabsContent>

              <TabsContent value="predictions" className="mt-4">
                <Card className="p-6 bg-black/[0.96] border-white/10">
                  <p className="text-neutral-400">Coming soon: Your predictions</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsportsBetting;
