import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const { toast } = useToast();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been signed out",
      });
    }
  };

  // Don't show the back button on the marketplace page itself
  const showBackButton = location.pathname !== "/marketplace";

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      {showBackButton && (
        <Link
          to="/marketplace"
          className="flex items-center text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>
      )}
      <Button
        variant="ghost"
        className="text-neutral-400 hover:text-white"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default Navbar;