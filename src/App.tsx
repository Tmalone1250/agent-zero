import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/code-assistant" element={<CodeAssistant />} />
          <Route path="/image-generator" element={<ImageGenerator />} />
          <Route path="/content-writer" element={<ContentWriter />} />
          <Route path="/data-analyzer" element={<DataAnalyzer />} />
          <Route path="/seo-optimizer" element={<SeoOptimizer />} />
          <Route path="/customer-service-bot" element={<CustomerServiceBot />} />
          <Route path="/market-analyst" element={<MarketAnalyst />} />
          <Route path="/translation-expert" element={<TranslationExpert />} />
          <Route path="/research-assistant" element={<ResearchAssistant />} />
          <Route path="/lead-generator" element={<LeadGenerator />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;