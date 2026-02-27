import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30"
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="CareerCompass Logo" className="h-10 w-auto rounded-lg" />
          <span className="text-xl font-bold text-gradient">CareerCompass</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</a>
          <Link
            to="/analyze"
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all glow-border"
          >
            Get Started
          </Link>
        </div>
        <Link
          to="/analyze"
          className="md:hidden px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
        >
          Start
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
