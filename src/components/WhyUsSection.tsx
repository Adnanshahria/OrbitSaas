import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Handshake, Compass, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyUsCard = ({
  title,
  description,
  icon: Icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="glass-card p-8 text-center group hover:bg-muted/20 transition-all duration-300"
    >
      {/* Icon */}
      <motion.div
        className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="w-8 h-8 text-primary" />
      </motion.div>

      {/* Title */}
      <h3 className="font-display text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export const WhyUsSection = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const icons = [Handshake, Compass, Wrench];

  return (
    <section id="why-us" className="py-24 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{t.whyUs.title}</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.whyUs.subtitle}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {t.whyUs.items.map((item, index) => (
            <WhyUsCard
              key={index}
              title={item.title}
              description={item.description}
              icon={icons[index]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
