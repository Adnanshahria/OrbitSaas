import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const techStack = {
  frontend: [
    { name: "React.js", color: "from-cyan-400 to-cyan-600" },
    { name: "Next.js 14", color: "from-gray-100 to-gray-300" },
    { name: "TypeScript", color: "from-blue-400 to-blue-600" },
    { name: "Tailwind CSS", color: "from-teal-400 to-teal-600" },
  ],
  backend: [
    { name: "Django", color: "from-green-500 to-green-700" },
    { name: "Python", color: "from-yellow-400 to-yellow-600" },
    { name: "Node.js", color: "from-lime-400 to-lime-600" },
    { name: "Scalable Microservices", color: "from-purple-400 to-purple-600" },
  ],
  infrastructure: [
    { name: "Cloud-Native Architecture", color: "from-orange-400 to-orange-600" },
    { name: "AWS", color: "from-amber-400 to-amber-600" },
    { name: "Google Cloud", color: "from-red-400 to-blue-500" },
    { name: "CI/CD Pipelines", color: "from-pink-400 to-pink-600" },
  ],
};

const TechBadge = ({ name, color }: { name: string; color: string }) => (
  <motion.div
    className="glass-card-glossy px-5 py-3 md:px-6 md:py-3.5 rounded-full inline-flex items-center gap-3 whitespace-nowrap badge-glow shimmer"
    whileHover={{ scale: 1.08, y: -3 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400 }}
  >
    <motion.div 
      className={`w-3 h-3 rounded-full bg-gradient-to-r ${color} shadow-lg`}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <span className="text-sm md:text-base font-medium text-foreground">{name}</span>
  </motion.div>
);

const MarqueeRow = ({
  items,
  direction = "left",
  speed = 30,
}: {
  items: { name: string; color: string }[];
  direction?: "left" | "right";
  speed?: number;
}) => {
  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden py-4">
      <motion.div
        className="flex gap-4"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {duplicatedItems.map((tech, index) => (
          <TechBadge key={`${tech.name}-${index}`} {...tech} />
        ))}
      </motion.div>
    </div>
  );
};

export const TechStackSection = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="tech-stack" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 container mx-auto px-4"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{t.techStack.title}</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.techStack.subtitle}
          </p>
        </motion.div>

        {/* Tech Categories */}
        <div className="space-y-12">
          {/* Frontend */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-center text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              {t.techStack.categories.frontend}
            </h3>
            <MarqueeRow items={techStack.frontend} direction="left" speed={25} />
          </motion.div>

          {/* Backend */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-center text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              {t.techStack.categories.backend}
            </h3>
            <MarqueeRow items={techStack.backend} direction="right" speed={28} />
          </motion.div>

          {/* Infrastructure */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-center text-sm font-semibold text-accent uppercase tracking-wider mb-4">
              {t.techStack.categories.infrastructure}
            </h3>
            <MarqueeRow items={techStack.infrastructure} direction="left" speed={30} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
