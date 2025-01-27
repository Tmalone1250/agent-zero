import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="text-white border-white/20 hover:bg-white/10"
        >
          Sign Out
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;