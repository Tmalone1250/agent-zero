import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CodeAssistant from "./pages/CodeAssistant";
import ImageGenerator from "./pages/ImageGenerator";
import ContentWriter from "./pages/ContentWriter";
import DataAnalyzer from "./pages/DataAnalyzer";
import SeoOptimizer from "./pages/SeoOptimizer";
import CustomerServiceBot from "./pages/CustomerServiceBot";
import MarketAnalyst from "./pages/MarketAnalyst";
import TranslationExpert from "./pages/TranslationExpert";
import ResearchAssistant from "./pages/ResearchAssistant";
import LeadGenerator from "./pages/LeadGenerator";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/signin" />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <PrivateRoute>
                <Marketplace />
              </PrivateRoute>
            }
          />
          <Route
            path="/code-assistant"
            element={
              <PrivateRoute>
                <CodeAssistant />
              </PrivateRoute>
            }
          />
          <Route
            path="/image-generator"
            element={
              <PrivateRoute>
                <ImageGenerator />
              </PrivateRoute>
            }
          />
          <Route
            path="/content-writer"
            element={
              <PrivateRoute>
                <ContentWriter />
              </PrivateRoute>
            }
          />
          <Route
            path="/data-analyzer"
            element={
              <PrivateRoute>
                <DataAnalyzer />
              </PrivateRoute>
            }
          />
          <Route
            path="/seo-optimizer"
            element={
              <PrivateRoute>
                <SeoOptimizer />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer-service-bot"
            element={
              <PrivateRoute>
                <CustomerServiceBot />
              </PrivateRoute>
            }
          />
          <Route
            path="/market-analyst"
            element={
              <PrivateRoute>
                <MarketAnalyst />
              </PrivateRoute>
            }
          />
          <Route
            path="/translation-expert"
            element={
              <PrivateRoute>
                <TranslationExpert />
              </PrivateRoute>
            }
          />
          <Route
            path="/research-assistant"
            element={
              <PrivateRoute>
                <ResearchAssistant />
              </PrivateRoute>
            }
          />
          <Route
            path="/lead-generator"
            element={
              <PrivateRoute>
                <LeadGenerator />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;