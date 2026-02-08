import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Crown, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LeaderCard = ({
  name,
  role,
  description,
  icon: Icon,
  index,
}: {
  name: string;
  role: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card-glossy p-8 md:p-10 gradient-border-animated text-center cursor-pointer transition-all duration-200 ease-out group"
    >
      <div className="relative z-10">
        {/* Avatar/Icon */}
        <motion.div
          className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 flex items-center justify-center relative shadow-xl"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent opacity-30 blur-xl animate-pulse" />
          <div className="absolute inset-1 rounded-full bg-background/50 backdrop-blur-sm" />
          <Icon className="w-12 h-12 md:w-14 md:h-14 text-primary relative z-10 drop-shadow-lg" />
        </motion.div>

        {/* Name */}
        <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-foreground group-hover:gradient-text-animated transition-all">
          {name}
        </h3>

        {/* Role */}
        <motion.p 
          className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider"
          whileHover={{ scale: 1.05 }}
        >
          {role}
        </motion.p>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Decorative line */}
        <motion.div
          className="mt-6 h-0.5 w-16 mx-auto bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export const LeadershipSection = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const icons = [Crown, Lightbulb];

  return (
    <section id="leadership" className="py-24 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{t.leadership.title}</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.leadership.subtitle}
          </p>
        </motion.div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {t.leadership.members.map((member, index) => (
            <LeaderCard
              key={index}
              name={member.name}
              role={member.role}
              description={member.description}
              icon={icons[index]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
