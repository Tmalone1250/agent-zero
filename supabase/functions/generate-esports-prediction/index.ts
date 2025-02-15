
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { matchId, userId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch match details
    const { data: match, error: matchError } = await supabase
      .from('esports_matches')
      .select('*')
      .eq('match_id', matchId)
      .single();

    if (matchError) throw matchError;

    // Fetch historical matches for both teams
    const { data: historicalMatches, error: histError } = await supabase
      .from('esports_historical_matches')
      .select('*')
      .or(`team1.eq.${match.team1},team1.eq.${match.team2},team2.eq.${match.team1},team2.eq.${match.team2}`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (histError) throw histError;

    // Calculate win rates and recent performance
    const team1Stats = calculateTeamStats(historicalMatches, match.team1);
    const team2Stats = calculateTeamStats(historicalMatches, match.team2);

    // Generate prediction
    const prediction = generatePrediction(match, team1Stats, team2Stats);

    // Store prediction
    const { error: predictionError } = await supabase
      .from('esports_predictions')
      .insert({
        user_id: userId,
        match_id: matchId,
        prediction: prediction.winner,
        confidence_score: prediction.confidence,
        reasoning: prediction.reasoning,
      });

    if (predictionError) throw predictionError;

    return new Response(
      JSON.stringify(prediction),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

function calculateTeamStats(matches: any[], teamName: string) {
  const teamMatches = matches.filter(m => m.team1 === teamName || m.team2 === teamName);
  const wins = teamMatches.filter(m => m.winner === teamName).length;
  const winRate = teamMatches.length > 0 ? wins / teamMatches.length : 0;

  return {
    winRate,
    recentMatches: teamMatches.slice(0, 5),
    totalMatches: teamMatches.length,
  };
}

function generatePrediction(match: any, team1Stats: any, team2Stats: any) {
  // Calculate base probability from odds
  const oddsTotal = (match.odds_team1 || 1) + (match.odds_team2 || 1);
  const oddsBasedProb1 = match.odds_team1 ? match.odds_team1 / oddsTotal : 0.5;

  // Combine odds with historical performance
  const winRateWeight = 0.3;
  const oddsWeight = 0.7;

  const team1Score = (team1Stats.winRate * winRateWeight) + (oddsBasedProb1 * oddsWeight);
  const team2Score = (team2Stats.winRate * winRateWeight) + ((1 - oddsBasedProb1) * oddsWeight);

  const winner = team1Score > team2Score ? match.team1 : match.team2;
  const confidence = Math.round(Math.abs(team1Score - team2Score) * 100);

  const reasoning = `Based on historical performance (${match.team1}: ${Math.round(team1Stats.winRate * 100)}% win rate, ${match.team2}: ${Math.round(team2Stats.winRate * 100)}% win rate) and current odds, ${winner} has a stronger chance of winning. Confidence is derived from team form and betting market indicators.`;

  return {
    winner,
    confidence: Math.min(confidence, 90), // Cap confidence at 90%
    reasoning,
    team1Probability: team1Score,
    team2Probability: team2Score,
  };
}
