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
import type { Database } from "@/integrations/supabase/types";

type Match = Database['public']['Tables']['esports_matches']['Row'];
type UserPreferences = Database['public']['Tables']['esports_user_preferences']['Row'];
type Prediction = Database['public']['Tables']['esports_predictions']['Row'];

const EsportsBetting = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPreferences();
    fetchMatches();
    fetchPredictions();
    setupRealtime();

    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  const setupRealtime = () => {
    const channel = supabase
      .channel('esports-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'esports_matches' },
        (payload) => {
          console.log('Received real-time update:', payload);
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            updateMatchesState(payload.new as Match);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateMatchesState = (updatedMatch: Match) => {
    setMatches(current => {
      const index = current.findIndex(m => m.id === updatedMatch.id);
      if (index === -1) {
        return [...current, updatedMatch];
      }
      const newMatches = [...current];
      newMatches[index] = updatedMatch;
      return newMatches;
    });
  };

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

      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchMatches = async () => {
    try {
      // Fetch live matches
      const { data: liveData, error: liveError } = await supabase
        .from('esports_matches')
        .select('*')
        .eq('status', 'running')
        .order('start_time', { ascending: true });

      if (liveError) throw liveError;
      setMatches(liveData || []);

      // Fetch upcoming matches
      const { data: upcomingData, error: upcomingError } = await supabase
        .from('esports_matches')
        .select('*')
        .eq('status', 'upcoming')
        .order('start_time', { ascending: true });

      if (upcomingError) throw upcomingError;
      setUpcomingMatches(upcomingData || []);

      // Trigger match data refresh
      await supabase.functions.invoke('fetch-esports-matches');
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

  const fetchPredictions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('esports_predictions')
        .select('*, esports_matches(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const handleGameChange = (value: string) => {
    setSelectedGame(value);
    if (value === 'all') {
      fetchMatches();
    } else {
      const filteredMatches = matches.filter(match => match.game_type === value);
      setMatches(filteredMatches);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateWinProbability = (odds1: number | null, odds2: number | null) => {
    if (!odds1 || !odds2) return "N/A";
    const total = odds1 + odds2;
    return `${Math.round((odds1 / total) * 100)}%`;
  };

  const generatePrediction = async (matchId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to generate predictions",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-esports-prediction', {
        body: { matchId, userId: user.id }
      });

      if (error) throw error;

      toast({
        title: "Prediction Generated",
        description: `Predicted winner: ${data.winner} (${data.confidence}% confidence)`,
      });

      // Refresh predictions
      fetchPredictions();
    } catch (error) {
      console.error('Error generating prediction:', error);
      toast({
        title: "Error",
        description: "Failed to generate prediction. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderMatchCard = (match: Match) => (
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
          {match.status === 'running' && (
            <div className="text-sm text-purple-400">
              {match.score_team1} - {match.score_team2}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => generatePrediction(match.match_id)}
            className="mt-2"
          >
            Generate Prediction
          </Button>
        </div>
      </div>
    </Card>
  );

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
                    matches.map(renderMatchCard)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="mt-4">
                <div className="space-y-4">
                  {upcomingMatches.length === 0 ? (
                    <Card className="p-6 bg-black/[0.96] border-white/10">
                      <p className="text-neutral-400">No upcoming matches available</p>
                    </Card>
                  ) : (
                    upcomingMatches.map(renderMatchCard)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="predictions" className="mt-4">
                <div className="space-y-4">
                  {predictions.length === 0 ? (
                    <Card className="p-6 bg-black/[0.96] border-white/10">
                      <p className="text-neutral-400">No predictions yet</p>
                    </Card>
                  ) : (
                    predictions.map((prediction) => (
                      <Card key={prediction.id} className="p-6 bg-black/[0.96] border-white/10">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-purple-400">Prediction: {prediction.prediction}</span>
                            <span className="text-green-400">Confidence: {prediction.confidence_score}%</span>
                          </div>
                          {prediction.reasoning && (
                            <p className="text-neutral-400 text-sm mt-2">{prediction.reasoning}</p>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsportsBetting;
