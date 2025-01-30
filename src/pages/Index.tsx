import { SplineSceneBasic } from "@/components/code.demo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        <SplineSceneBasic />
      </div>
    </div>
  );
};

export default Index;