import { motion } from "framer-motion";
import {
  Target, ShieldAlert, XCircle, Briefcase, GraduationCap,
  ChevronRight, AlertTriangle, CheckCircle2, FileSearch
} from "lucide-react";

export interface ResultsData {
  atsScore: number;
  atsImprovements: string[];
  careerPaths: { title: string; match: number; growth: string }[];
  skills: { strong: string[]; missing: string[] };
  rejectionReasons: { reason: string; severity: "high" | "medium" | "low" }[];
  aiRisk: { role: string; risk: number; label: string }[];
  jobs: { title: string; company: string; type: string; location: string; link: string }[];
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
      
      {/* ATS Score Section (NEW) */}
      <div className="glass rounded-xl p-6 border-l-4 border-l-primary">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">ATS Compatibility Score</h3>
          </div>
          <span className={`text-3xl font-black ${data.atsScore > 75 ? 'text-success' : data.atsScore > 50 ? 'text-warning' : 'text-destructive'}`}>
            {data.atsScore}/100
          </span>
        </div>
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-semibold text-foreground uppercase">How to improve:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {data.atsImprovements.map((imp, i) => (
              <li key={i} className="text-sm text-muted-foreground">{imp}</li>
            ))}
          </ul>
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

      {/* Jobs & Internships from JSearch */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Real-time Opportunities</h3>
        </div>
        <div className="space-y-3">
          {data.jobs.length > 0 ? data.jobs.map((j, i) => (
            <a href={j.link} target="_blank" rel="noopener noreferrer" key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-surface-hover transition-colors cursor-pointer group">
              <div>
                <p className="font-medium text-foreground">{j.title}</p>
                <p className="text-sm text-muted-foreground">{j.company} · {j.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${j.type.includes("Intern") ? "bg-info/10 text-info" : "bg-primary/10 text-primary"}`}>
                  {j.type}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>
          )) : <p className="text-sm text-muted-foreground">No current listings found. Keep upskilling!</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsDashboard;