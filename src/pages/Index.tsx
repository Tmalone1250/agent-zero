import { SplineSceneBasic } from "@/components/code.demo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        <SplineSceneBasic />
        <div className="absolute top-4 right-4">
          <Link to="/auth/signin">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;