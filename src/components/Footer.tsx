import logo from "@/assets/logo.jpeg";

const Footer = () => (
  <footer className="border-t border-border/30 py-10">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img src={logo} alt="CareerCompass" className="h-8 rounded" />
        <span className="font-semibold text-gradient">CareerCompass</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © 2026 CareerCompass · Built for Hackathon · AI-Powered Career Intelligence
      </p>
    </div>
  </footer>
);

export default Footer;
