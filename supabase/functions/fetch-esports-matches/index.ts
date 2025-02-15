
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const PANDASCORE_API_KEY = Deno.env.get('PANDASCORE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchAndStorePandaScoreMatches() {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
  
  try {
    // Fetch live and upcoming matches from PandaScore
    const response = await fetch(
      'https://api.pandascore.co/matches/running,upcoming?sort=begin_at&page[size]=50',
      {
        headers: {
          'Authorization': `Bearer ${PANDASCORE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`PandaScore API error: ${response.status}`);
    }

    const matches = await response.json();

    // Transform and store matches
    for (const match of matches) {
      const matchData = {
        match_id: match.id.toString(),
        game_type: match.videogame.slug,
        tournament: match.league.name,
        team1: match.opponents[0]?.opponent.name || 'TBD',
        team2: match.opponents[1]?.opponent.name || 'TBD',
        start_time: match.begin_at,
        status: match.status,
        score_team1: match.results[0]?.score || null,
        score_team2: match.results[1]?.score || null,
        odds_team1: match.games[0]?.odds?.team1 || null,
        odds_team2: match.games[0]?.odds?.team2 || null,
      };

      // Upsert match data
      const { error } = await supabase
        .from('esports_matches')
        .upsert(
          { 
            ...matchData,
            updated_at: new Date().toISOString()
          },
          { 
            onConflict: 'match_id',
            ignoreDuplicates: false 
          }
        );

      if (error) {
        console.error('Error upserting match:', error);
      }
    }

    return { success: true, message: 'Matches updated successfully' };
  } catch (error) {
    console.error('Error in fetchAndStorePandaScoreMatches:', error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const result = await fetchAndStorePandaScoreMatches();
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 500
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
