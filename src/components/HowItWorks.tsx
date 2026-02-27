import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Upload Resume", desc: "Drop your resume or paste LinkedIn/GitHub links" },
  { num: "02", title: "AI Analysis", desc: "Our engine processes your skills, experience, and market data" },
  { num: "03", title: "Get Insights", desc: "Receive career paths, skill gaps, risk scores, and opportunities" },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Three simple steps to unlock your career potential
          </p>
        </motion.div>
        <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex-1 relative glass rounded-xl p-8 text-center"
            >
              <span className="text-5xl font-black text-primary/20">{s.num}</span>
              <h3 className="text-lg font-bold text-foreground mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
