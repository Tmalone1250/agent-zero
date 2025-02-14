
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Marketplace from "./pages/Marketplace";
import MyAgents from "./pages/MyAgents";
import AcademicAssistant from "./pages/AcademicAssistant";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import DocumentFormatter from "./pages/DocumentFormatter";
import TranslationExpert from "./pages/TranslationExpert";
import CodeAssistant from "./pages/CodeAssistant";
import ResearchAssistant from "./pages/ResearchAssistant";
import CustomerServiceBot from "./pages/CustomerServiceBot";
import DataAnalyzer from "./pages/DataAnalyzer";
import SeoOptimizer from "./pages/SeoOptimizer";
import ContentWriter from "./pages/ContentWriter";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/my-agents" element={<MyAgents />} />
        <Route path="/academic-assistant" element={<AcademicAssistant />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/document-formatter" element={<DocumentFormatter />} />
        <Route path="/translation-expert" element={<TranslationExpert />} />
        <Route path="/code-assistant" element={<CodeAssistant />} />
        <Route path="/research-assistant" element={<ResearchAssistant />} />
        <Route path="/customer-service-bot" element={<CustomerServiceBot />} />
        <Route path="/data-analyzer" element={<DataAnalyzer />} />
        <Route path="/seo-optimizer" element={<SeoOptimizer />} />
        <Route path="/content-writer" element={<ContentWriter />} />
      </Routes>
    </Router>
  );
};

export default App;
