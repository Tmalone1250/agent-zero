import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Marketplace from "./pages/Marketplace";
import MyAgents from "./pages/MyAgents";
import AcademicAssistant from "./pages/AcademicAssistant";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import JobSearch from "./pages/JobSearch";

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
        <Route path="/job-search" element={<JobSearch />} />
      </Routes>
    </Router>
  );
};

export default App;