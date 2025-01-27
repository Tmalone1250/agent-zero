import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-black/[0.96] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6">
        Welcome to AI Agents
      </h1>
      <p className="text-lg md:text-xl text-neutral-400 text-center max-w-2xl mb-8">
        Discover and interact with AI agents designed to help you with various tasks
      </p>
      <Link to="/auth/signin">
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6">
          Get Started
        </Button>
      </Link>
    </div>
  );
};

export default Index;