import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Upload, Brain, TrendingUp, ShieldAlert, Target, Zap } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Resume Analysis",
    desc: "Upload your resume for AI-powered parsing and skill extraction",
  },
  {
    icon: Brain,
    title: "AI Career Match",
    desc: "Get personalized career paths based on your profile and market data",
  },
  {
    icon: TrendingUp,
    title: "Skills Gap Analysis",
    desc: "Discover what skills you need to land your dream role",
  },
  {
    icon: ShieldAlert,
    title: "AI Replacement Risk",
    desc: "Understand automation risk for your target careers",
  },
  {
    icon: Target,
    title: "Job & Internship Matching",
    desc: "Curated opportunities aligned with your career trajectory",
  },
  {
    icon: Zap,
    title: "Rejection Insights",
    desc: "Know why applications fail and how to fix them",
  },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(185_80%_50%_/_0.03),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Career Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Navigate Your
            <br />
            <span className="text-gradient">Career Path</span>
            <br />
            With Precision
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload your resume, connect your profiles, and let AI analyze your strengths, 
            gaps, and opportunities across the job market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all glow-border"
            >
              <Upload className="w-5 h-5" />
              Analyze My Career
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border bg-secondary text-secondary-foreground font-semibold text-lg hover:bg-surface-hover transition-all"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className="glass rounded-xl p-6 hover:glow-border transition-all group"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
