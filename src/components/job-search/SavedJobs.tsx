import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SavedJob {
  id: string;
  job_title: string;
  company_name: string;
  job_url: string;
  saved_at: string;
}

export const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('*')
      .order('saved_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved jobs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved jobs.",
      });
    } else {
      setSavedJobs(data);
    }
  };

  const handleRemoveJob = async (jobId: string) => {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('id', jobId);

    if (error) {
      console.error('Error removing saved job:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove job.",
      });
    } else {
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
      toast({
        title: "Success",
        description: "Job removed from saved list.",
      });
    }
  };

  if (savedJobs.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6 p-6 bg-black/[0.96] border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="h-5 w-5 text-purple-500" />
        <h2 className="text-2xl font-semibold text-white">Saved Jobs</h2>
      </div>
      <div className="space-y-4">
        {savedJobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50"
          >
            <div>
              <h3 className="text-white font-medium">{job.job_title}</h3>
              <p className="text-gray-400">{job.company_name}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(job.job_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveJob(job.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};