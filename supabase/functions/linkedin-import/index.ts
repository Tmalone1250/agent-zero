
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
    const profileResponse = await fetch('https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))', {
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
    const positionsResponse = await fetch('https://api.linkedin.com/v2/positions?q=members&projection=(elements*(title,companyName,startDate,endDate,locationName,description))', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!positionsResponse.ok) {
      throw new Error('Failed to fetch positions');
    }

    const positionsData = await positionsResponse.json();

    // Fetch education
    const educationResponse = await fetch('https://api.linkedin.com/v2/educations?q=members&projection=(elements*(schoolName,degreeName,fieldOfStudy,startDate,endDate))', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!educationResponse.ok) {
      throw new Error('Failed to fetch education');
    }

    const educationData = await educationResponse.json();

    // Fetch skills
    const skillsResponse = await fetch('https://api.linkedin.com/v2/skills?q=members&projection=(elements*(name))', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!skillsResponse.ok) {
      throw new Error('Failed to fetch skills');
    }

    const skillsData = await skillsResponse.json();

    const profilePicture = profileData.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier || null;

    const resumeData = {
      personalInfo: {
        fullName: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
        email: emailData.elements[0]['handle~'].emailAddress,
        linkedIn: `https://www.linkedin.com/in/${profileData.id}`,
        profilePicture,
        phone: '', // LinkedIn API doesn't provide phone number
        location: positionsData.elements[0]?.locationName || '', // Using most recent position's location
      },
      workExperience: positionsData.elements.map((position: any) => ({
        title: position.title,
        company: position.companyName,
        location: position.locationName,
        startDate: `${position.startDate.year}-${position.startDate.month || '01'}`,
        endDate: position.endDate ? `${position.endDate.year}-${position.endDate.month || '01'}` : 'Present',
        description: position.description || '',
        achievements: [], // LinkedIn API doesn't provide specific achievements
      })),
      education: educationData.elements.map((education: any) => ({
        degree: education.degreeName,
        institution: education.schoolName,
        fieldOfStudy: education.fieldOfStudy,
        location: '', // LinkedIn API doesn't provide education location
        graduationDate: education.endDate ? `${education.endDate.year}` : 'Present',
        startDate: education.startDate ? `${education.startDate.year}` : '',
      })),
      skills: skillsData.elements.map((skill: any) => skill.name),
      languages: [], // LinkedIn API doesn't provide languages
      projects: [], // LinkedIn API doesn't provide projects
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
