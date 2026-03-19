import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ResumeUpload from "@/components/ResumeUpload";
import ProfileLinks from "@/components/ProfileLinks";
import ResultsDashboard from "@/components/ResultsDashboard";
import Footer from "@/components/Footer";

const Analyze = () => {
  const [file, setFile] = useState<File | null>(null);
  const [links, setLinks] = useState({ linkedin: "", github: "" });
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = file || links.linkedin || links.github;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setAnalyzing(true);
    setError(null);

    const formData = new FormData();
    if (file) formData.append("resume", file);
    if (links.linkedin) formData.append("linkedin", links.linkedin);
    if (links.github) formData.append("github", links.github);

    try {
      const response = await fetch("/career-compass-backend/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze profile.");
      
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Career <span className="text-gradient">Analysis</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Upload your resume and connect your profiles for AI-powered insights
          </p>
        </motion.div>

        {!results ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Resume</h2>
              <ResumeUpload onFileSelect={setFile} selectedFile={file} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Profile Links</h2>
              <ProfileLinks onLinksChange={setLinks} />
            </div>

            {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}

            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || analyzing}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                canAnalyze
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-border"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI... (This may take a minute)
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze My Career
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <div>
            <button
              onClick={() => setResults(null)}
              className="text-sm text-primary hover:text-primary/80 mb-6 inline-flex items-center gap-1 transition-colors"
            >
              ← Modify Input
            </button>
            <ResultsDashboard data={results} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Analyze;