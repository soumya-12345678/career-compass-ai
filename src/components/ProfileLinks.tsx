import { useState } from "react";
import { Linkedin, Github, Link as LinkIcon } from "lucide-react";

interface ProfileLinksProps {
  onLinksChange: (links: { linkedin: string; github: string }) => void;
}

const ProfileLinks = ({ onLinksChange }: ProfileLinksProps) => {
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  const handleChange = (field: "linkedin" | "github", value: string) => {
    const updated = field === "linkedin" ? { linkedin: value, github } : { linkedin, github: value };
    if (field === "linkedin") setLinkedin(value);
    else setGithub(value);
    onLinksChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-info" />
        <input
          type="url"
          placeholder="LinkedIn Profile URL"
          value={linkedin}
          onChange={(e) => handleChange("linkedin", e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
      <div className="relative">
        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
        <input
          type="url"
          placeholder="GitHub Profile URL"
          value={github}
          onChange={(e) => handleChange("github", e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
    </div>
  );
};

export default ProfileLinks;
