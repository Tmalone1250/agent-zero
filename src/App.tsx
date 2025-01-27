import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import MyAgents from "./pages/MyAgents";
import Profile from "./pages/Profile";
import AcademicAssistant from "./pages/AcademicAssistant";
import CodeAssistant from "./pages/CodeAssistant";
import ContentWriter from "./pages/ContentWriter";
import CustomerServiceBot from "./pages/CustomerServiceBot";
import DataAnalyzer from "./pages/DataAnalyzer";
import ImageGenerator from "./pages/ImageGenerator";
import LeadGenerator from "./pages/LeadGenerator";
import MarketAnalyst from "./pages/MarketAnalyst";
import ResearchAssistant from "./pages/ResearchAssistant";
import ResearchWriting from "./pages/ResearchWriting";
import SeoOptimizer from "./pages/SeoOptimizer";
import TranslationExpert from "./pages/TranslationExpert";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/my-agents" element={<MyAgents />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/academic-assistant" element={<AcademicAssistant />} />
        <Route path="/code-assistant" element={<CodeAssistant />} />
        <Route path="/content-writer" element={<ContentWriter />} />
        <Route path="/customer-service-bot" element={<CustomerServiceBot />} />
        <Route path="/data-analyzer" element={<DataAnalyzer />} />
        <Route path="/image-generator" element={<ImageGenerator />} />
        <Route path="/lead-generator" element={<LeadGenerator />} />
        <Route path="/market-analyst" element={<MarketAnalyst />} />
        <Route path="/research-assistant" element={<ResearchAssistant />} />
        <Route path="/research-writing" element={<ResearchWriting />} />
        <Route path="/seo-optimizer" element={<SeoOptimizer />} />
        <Route path="/translation-expert" element={<TranslationExpert />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;