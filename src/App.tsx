import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Import pages
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Marketplace from "@/pages/Marketplace";
import MyAgents from "@/pages/MyAgents";
import { Toaster } from "@/components/ui/toaster";

// Import AI agent pages
import CodeAssistant from "@/pages/CodeAssistant";
import ContentWriter from "@/pages/ContentWriter";
import CustomerServiceBot from "@/pages/CustomerServiceBot";
import DataAnalyzer from "@/pages/DataAnalyzer";
import ImageGenerator from "@/pages/ImageGenerator";
import LeadGenerator from "@/pages/LeadGenerator";
import MarketAnalyst from "@/pages/MarketAnalyst";
import ResearchAssistant from "@/pages/ResearchAssistant";
import SeoOptimizer from "@/pages/SeoOptimizer";
import TranslationExpert from "@/pages/TranslationExpert";

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/signin"
          element={session ? <Navigate to="/dashboard" /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={session ? <Navigate to="/dashboard" /> : <SignUp />}
        />
        <Route
          path="/dashboard"
          element={session ? <Dashboard /> : <Navigate to="/signin" />}
        />
        <Route
          path="/profile"
          element={session ? <Profile /> : <Navigate to="/signin" />}
        />
        <Route
          path="/marketplace"
          element={session ? <Marketplace /> : <Navigate to="/signin" />}
        />
        <Route
          path="/my-agents"
          element={session ? <MyAgents /> : <Navigate to="/signin" />}
        />
        <Route
          path="/code-assistant"
          element={session ? <CodeAssistant /> : <Navigate to="/signin" />}
        />
        <Route
          path="/content-writer"
          element={session ? <ContentWriter /> : <Navigate to="/signin" />}
        />
        <Route
          path="/customer-service-bot"
          element={session ? <CustomerServiceBot /> : <Navigate to="/signin" />}
        />
        <Route
          path="/data-analyzer"
          element={session ? <DataAnalyzer /> : <Navigate to="/signin" />}
        />
        <Route
          path="/image-generator"
          element={session ? <ImageGenerator /> : <Navigate to="/signin" />}
        />
        <Route
          path="/lead-generator"
          element={session ? <LeadGenerator /> : <Navigate to="/signin" />}
        />
        <Route
          path="/market-analyst"
          element={session ? <MarketAnalyst /> : <Navigate to="/signin" />}
        />
        <Route
          path="/research-assistant"
          element={session ? <ResearchAssistant /> : <Navigate to="/signin" />}
        />
        <Route
          path="/seo-optimizer"
          element={session ? <SeoOptimizer /> : <Navigate to="/signin" />}
        />
        <Route
          path="/translation-expert"
          element={session ? <TranslationExpert /> : <Navigate to="/signin" />}
        />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;