import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SearchHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="ghost"
        className="mb-6 text-white hover:text-white/80"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-8">
        Job Search Assistant
      </h1>
    </>
  );
};