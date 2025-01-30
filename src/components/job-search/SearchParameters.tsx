import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchParametersProps {
  jobPlatform: string;
  setJobPlatform: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  jobType: string;
  setJobType: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
}

export const SearchParameters = ({
  jobPlatform,
  setJobPlatform,
  keywords,
  setKeywords,
  jobType,
  setJobType,
  location,
  setLocation,
}: SearchParametersProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white">Job Platform</Label>
        <Select onValueChange={setJobPlatform} value={jobPlatform}>
          <SelectTrigger className="bg-black/[0.96] border-white/10 text-white">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent className="bg-black/[0.96] border-white/10">
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="indeed">Indeed</SelectItem>
            <SelectItem value="glassdoor">Glassdoor</SelectItem>
            <SelectItem value="ziprecruiter">ZipRecruiter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white">Keywords</Label>
        <Input
          placeholder="e.g., Remote JavaScript Developer"
          className="bg-black/[0.96] border-white/10 text-white"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>

      <div>
        <Label className="text-white">Job Type</Label>
        <Select onValueChange={setJobType} value={jobType}>
          <SelectTrigger className="bg-black/[0.96] border-white/10 text-white">
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent className="bg-black/[0.96] border-white/10">
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white">Location</Label>
        <Input
          placeholder="e.g., San Francisco, CA"
          className="bg-black/[0.96] border-white/10 text-white"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
    </div>
  );
};