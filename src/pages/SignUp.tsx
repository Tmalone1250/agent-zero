
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Starting sign up process...");
    
    // Validate password before attempting signup
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description: passwordError,
      });
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("Sign up response:", { data, error });

      if (error) {
        console.error("Sign up error:", error);
        toast({
          variant: "destructive",
          title: "Error signing up",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Success!",
          description: "Account created successfully. Redirecting...",
        });
        // The onAuthStateChange listener will handle the redirect
      }
    } catch (error: any) {
      console.error("Unexpected error during sign up:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.96] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-black/[0.96] border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
              required
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-center text-neutral-400">
          Already have an account?{" "}
          <Link to="/auth/signin" className="text-purple-400 hover:text-purple-300">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default SignUp;
