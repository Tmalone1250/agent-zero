
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { access_token } = await req.json();

    if (!access_token) {
      throw new Error('Access token is required');
    }

    // Fetch basic profile information
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LinkedIn profile');
    }

    const profileData = await profileResponse.json();

    // Fetch email address
    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to fetch email');
    }

    const emailData = await emailResponse.json();

    // Fetch positions/experience
    const positionsResponse = await fetch('https://api.linkedin.com/v2/positions?q=members&projection=(elements*(title,companyName,startDate,endDate,locationName))', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!positionsResponse.ok) {
      throw new Error('Failed to fetch positions');
    }

    const positionsData = await positionsResponse.json();

    const resumeData = {
      personalInfo: {
        fullName: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
        email: emailData.elements[0]['handle~'].emailAddress,
        linkedIn: `https://www.linkedin.com/in/${profileData.id}`,
      },
      workExperience: positionsData.elements.map((position: any) => ({
        title: position.title,
        company: position.companyName,
        location: position.locationName,
        startDate: `${position.startDate.year}-${position.startDate.month || '01'}`,
        endDate: position.endDate ? `${position.endDate.year}-${position.endDate.month || '01'}` : 'Present',
        description: '',
        achievements: [],
      })),
    };

    return new Response(
      JSON.stringify(resumeData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
