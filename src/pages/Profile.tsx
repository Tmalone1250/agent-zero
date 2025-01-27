import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pen, Bell, Link as LinkIcon, CreditCard, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<'profiles'>;

interface UserProfile {
  first_name: string;
  last_name: string;
  city: string;
  country: string;
  title: string;
  role: string;
  company_website: string;
  writing_style: string;
  linkedin_profile: string;
  notification_new_follower: boolean;
  notification_new_rating: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    first_name: "",
    last_name: "",
    city: "",
    country: "",
    title: "",
    role: "",
    company_website: "",
    writing_style: "",
    linkedin_profile: "",
    notification_new_follower: false,
    notification_new_rating: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          city: data.city || "",
          country: data.country || "",
          title: data.title || "",
          role: data.role || "",
          company_website: data.company_website || "",
          writing_style: data.writing_style || "",
          linkedin_profile: data.linkedin_profile || "",
          notification_new_follower: data.notification_new_follower || false,
          notification_new_rating: data.notification_new_rating || false,
        });
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSaveUserContext = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        city: profile.city,
        country: profile.country,
        title: profile.title,
        role: profile.role,
        company_website: profile.company_website,
        writing_style: profile.writing_style,
        linkedin_profile: profile.linkedin_profile,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to save user context",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "User context saved successfully",
    });
  };

  const handleSaveNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        notification_new_follower: profile.notification_new_follower,
        notification_new_rating: profile.notification_new_rating,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating notifications:", error);
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Notification settings saved successfully",
    });
  };

  const handleDeleteAccount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
      return;
    }

    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black/[0.96] p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">User Settings</h1>
        
        <Tabs defaultValue="user-context" className="space-y-6">
          <TabsList className="bg-white/5 text-white">
            <TabsTrigger value="user-context" className="gap-2">
              <Pen className="w-4 h-4" />
              User Context
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <LinkIcon className="w-4 h-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="credits" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Credits
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user-context">
            <Card>
              <CardContent className="pt-6">
                <p className="text-neutral-400 mb-6">
                  Share who you are, your company website, your writing style, and your LinkedIn profile URL so that agents can better tailor their responses to your user context.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profile.first_name}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={profile.country}
                      onValueChange={(value) => setProfile({ ...profile, country: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        {/* Add more countries as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <Label htmlFor="company_website">Company Website</Label>
                  <Input
                    id="company_website"
                    value={profile.company_website}
                    onChange={(e) => setProfile({ ...profile, company_website: e.target.value })}
                  />
                </div>

                <div className="space-y-2 mt-6">
                  <Label htmlFor="writing_style">Writing Style</Label>
                  <Textarea
                    id="writing_style"
                    value={profile.writing_style}
                    onChange={(e) => setProfile({ ...profile, writing_style: e.target.value })}
                  />
                </div>

                <div className="space-y-2 mt-6">
                  <Label htmlFor="linkedin_profile">LinkedIn Profile</Label>
                  <Input
                    id="linkedin_profile"
                    value={profile.linkedin_profile}
                    onChange={(e) => setProfile({ ...profile, linkedin_profile: e.target.value })}
                  />
                </div>

                <Button 
                  className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={handleSaveUserContext}
                >
                  Save
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Manage your email notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notification_new_follower"
                      checked={profile.notification_new_follower}
                      onCheckedChange={(checked) => 
                        setProfile({ ...profile, notification_new_follower: checked as boolean })
                      }
                    />
                    <Label htmlFor="notification_new_follower">Notification on new follower</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notification_new_rating"
                      checked={profile.notification_new_rating}
                      onCheckedChange={(checked) => 
                        setProfile({ ...profile, notification_new_rating: checked as boolean })
                      }
                    />
                    <Label htmlFor="notification_new_rating">Notification on new agent rating</Label>
                  </div>
                </div>

                <Button 
                  className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={handleSaveNotifications}
                >
                  Save
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardContent className="pt-6">
                <p className="text-neutral-400 mb-6">
                  Connect third party data sources to give agents access to specialized data sets that can be accessed on your behalf. We'll let you know when an agent tries to use your data source.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">𝕏</span>
                      <div>
                        <h4 className="font-semibold">Connection</h4>
                        <p className="text-sm text-neutral-400">Connect your X account to claim your username@agent.ai SecondBrain email address.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline">Connect</Button>
                      <div className="bg-blue-500 text-white text-sm px-2 py-1 rounded">+50</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">G</span>
                      <div>
                        <h4 className="font-semibold">Google Connections</h4>
                        <p className="text-sm text-neutral-400">No Google account connected yet</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">H</span>
                      <div>
                        <h4 className="font-semibold">HubSpot Connections</h4>
                        <p className="text-sm text-neutral-400">Connect your HubSpot account</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credits">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Credits Management</h3>
                <p className="text-neutral-400">
                  Manage your credits and billing information here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-destructive mb-2">Delete Account</h3>
                <p className="text-neutral-400 mb-6">
                  You can close your account and delete your data from agent.ai anytime.
                </p>
                
                <Button 
                  variant="destructive"
                  onClick={handleDeleteAccount}
                >
                  Delete account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;