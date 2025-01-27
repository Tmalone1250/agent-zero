'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
 
export function SplineSceneBasic() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/auth/signin');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        
        <div className="flex h-full">
          {/* Left content */}
          <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
            <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Agent Zero
              <br />
              <span className="text-2xl md:text-4xl bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text">
                Your Digital Workforce
              </span>
            </h1>
            <p className="mt-4 text-neutral-300 max-w-lg text-sm md:text-base">
              Hire specialized AI agents to handle your tasks. From data analysis to creative work,
              our agents are ready to join your team and amplify your capabilities.
            </p>
            <div className="mt-8 flex gap-4">
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                className="text-neutral-400 border-white/20 hover:bg-black hover:text-white transition-colors"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right content */}
          <div className="flex-1 relative">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-black/[0.96] border-white/10">
          <h3 className="text-xl font-semibold text-white mb-2">Specialized Agents</h3>
          <p className="text-neutral-400">
            Choose from a variety of AI agents, each trained for specific tasks and industries.
          </p>
        </Card>
        <Card className="p-6 bg-black/[0.96] border-white/10">
          <h3 className="text-xl font-semibold text-white mb-2">24/7 Availability</h3>
          <p className="text-neutral-400">
            Your AI workforce never sleeps, ensuring round-the-clock productivity.
          </p>
        </Card>
        <Card className="p-6 bg-black/[0.96] border-white/10">
          <h3 className="text-xl font-semibold text-white mb-2">Seamless Integration</h3>
          <p className="text-neutral-400">
            Easily integrate AI agents into your existing workflows and tools.
          </p>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="w-full p-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-white/10">
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your AI Team?
          </h2>
          <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
            Start with a single agent or build a complete AI workforce. Scale up or down as needed,
            with flexible hiring options designed for your success.
          </p>
          <Button 
            className="bg-white text-black hover:bg-neutral-200"
            onClick={() => navigate('/marketplace')}
          >
            Get Started Now
          </Button>
        </div>
      </Card>
    </div>
  )
}