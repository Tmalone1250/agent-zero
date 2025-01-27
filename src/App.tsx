import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import CodeAssistant from "./pages/CodeAssistant";
import ContentWriter from "./pages/ContentWriter";
import CustomerServiceBot from "./pages/CustomerServiceBot";
import DataAnalyzer from "./pages/DataAnalyzer";
import ImageGenerator from "./pages/ImageGenerator";
import LeadGenerator from "./pages/LeadGenerator";
import MarketAnalyst from "./pages/MarketAnalyst";
import ResearchAssistant from "./pages/ResearchAssistant";
import SeoOptimizer from "./pages/SeoOptimizer";
import TranslationExpert from "./pages/TranslationExpert";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/code-assistant" element={<CodeAssistant />} />
        <Route path="/content-writer" element={<ContentWriter />} />
        <Route path="/customer-service-bot" element={<CustomerServiceBot />} />
        <Route path="/data-analyzer" element={<DataAnalyzer />} />
        <Route path="/image-generator" element={<ImageGenerator />} />
        <Route path="/lead-generator" element={<LeadGenerator />} />
        <Route path="/market-analyst" element={<MarketAnalyst />} />
        <Route path="/research-assistant" element={<ResearchAssistant />} />
        <Route path="/seo-optimizer" element={<SeoOptimizer />} />
        <Route path="/translation-expert" element={<TranslationExpert />} />
      </Routes>
    </Router>
  );
}

export default App;