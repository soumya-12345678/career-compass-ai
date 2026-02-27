import { motion } from "framer-motion";
import {
  Target, ShieldAlert, XCircle, Briefcase, GraduationCap,
  ChevronRight, AlertTriangle, CheckCircle2, FileSearch, ExternalLink
} from "lucide-react";

export interface ResultsData {
  search_term?: string; // NEW: Added search term
  careerPaths: { title: string; match: number; growth: string }[];
  skills: { strong: string[]; missing: string[] };
  rejectionReasons: { reason: string; severity: "high" | "medium" | "low" }[];
  aiRisk: { role: string; risk: number; label: string }[];
  jobs: { 
    title: string; 
    company: string; 
    type: string; 
    location: string; 
    link: string;
    atsScore: number;
    improvements: string[];
  }[];
}

const severityColors: Record<string, string> = {
  high: "text-destructive",
  medium: "text-warning",
  low: "text-success",
};

const riskBarColor = (risk: number) =>
  risk < 25 ? "bg-success" : risk < 50 ? "bg-warning" : "bg-destructive";

const ResultsDashboard = ({ data }: { data: ResultsData }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      
      {/* Real-time Jobs with LIVE ATS Scoring */}
      <div className="glass rounded-xl p-6 border-t-4 border-t-primary">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Real-Time Opportunities & ATS Match</h3>
        </div>
        
        <div className="space-y-4">
          {data.jobs.length > 0 ? data.jobs.map((j, i) => (
            <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                
                {/* Job Details */}
                <div>
                  <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" /> {j.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{j.company} · {j.location}</p>
                  <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-md font-medium ${j.type.includes("Intern") ? "bg-info/10 text-info" : "bg-primary/10 text-primary"}`}>
                    {j.type}
                  </span>
                </div>

                {/* ATS Score & Apply Button */}
                <div className="flex flex-col items-start md:items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">ATS Match:</span>
                    <span className={`text-2xl font-black ${j.atsScore >= 75 ? 'text-success' : j.atsScore >= 50 ? 'text-warning' : 'text-destructive'}`}>
                      {j.atsScore}%
                    </span>
                  </div>
                  <a href={j.link} target="_blank" rel="noopener noreferrer" className="bg-primary text-primary-foreground text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Apply Now
                  </a>
                </div>
              </div>

              {/* Resume Improvement Tips for this specific job */}
              {j.improvements && j.improvements.length > 0 && (
                <div className="bg-background rounded-md p-3 border border-border/50">
                  <h5 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-2">
                    <FileSearch className="w-3 h-3 text-primary" /> How to improve your resume for this exact role:
                  </h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {j.improvements.map((imp, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">{imp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )) : <p className="text-sm text-muted-foreground text-center py-4">No current listings found. Keep upskilling!</p>}

          {/* NEW: Show More Button */}
          {data.search_term && (
            <div className="mt-6 pt-4 flex justify-center border-t border-border">
              <a 
                href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(data.search_term)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary font-semibold hover:bg-primary/10 px-6 py-3 rounded-lg border-2 border-primary transition-all duration-300"
              >
                Show All {data.search_term} Openings
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Career Paths */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Recommended Career Paths</h3>
        </div>
        <div className="space-y-3">
          {data.careerPaths.map((c) => (
            <div key={c.title} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-surface-hover transition-colors">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">{c.title}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-primary font-semibold">{c.match}% match</span>
                <span className="text-success">{c.growth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <h3 className="font-bold text-foreground">Strong Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.strong.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">{s}</span>
            ))}
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-bold text-foreground">Skills to Develop</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.missing.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Rejection Reasons */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="w-5 h-5 text-destructive" />
          <h3 className="font-bold text-foreground">Potential Rejection Risks</h3>
        </div>
        <div className="space-y-3">
          {data.rejectionReasons.map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <AlertTriangle className={`w-4 h-4 mt-0.5 ${severityColors[r.severity]}`} />
              <div>
                <p className="text-sm text-foreground">{r.reason}</p>
                <span className={`text-xs font-medium uppercase ${severityColors[r.severity]}`}>{r.severity} risk</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Replacement Risk */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">AI Replacement Risk</h3>
        </div>
        <div className="space-y-4">
          {data.aiRisk.map((r) => (
            <div key={r.role}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">{r.role}</span>
                <span className="text-xs font-semibold text-muted-foreground">{r.risk}% · {r.label}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.risk}%` }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className={`h-full rounded-full ${riskBarColor(r.risk)}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsDashboard;