import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroSplashProps {
    onComplete: () => void;
}

export const IntroSplash = ({ onComplete }: IntroSplashProps) => {
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        // Auto-hide after animation completes (1.8s total)
        const timer = setTimeout(() => {
            setShowIntro(false);
            onComplete();
        }, 1800);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {showIntro && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    {/* Subtle gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

                    {/* Logo animation container */}
                    <div className="relative flex flex-col items-center">
                        {/* Glow ring - CSS animation for performance */}
                        <motion.div
                            className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full"
                            style={{
                                background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: [0, 1.5, 1.2],
                                opacity: [0, 0.8, 0.4]
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />

                        {/* Logo */}
                        <motion.img
                            src="/orbit_saas_logo.png"
                            alt="ORBIT SaaS"
                            className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl object-contain"
                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                            animate={{
                                scale: 1,
                                rotate: 0,
                                opacity: 1
                            }}
                            transition={{
                                duration: 0.6,
                                delay: 0.2,
                                type: "spring",
                                stiffness: 150,
                                damping: 15
                            }}
                        />

                        {/* Brand name */}
                        <motion.div
                            className="mt-6 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                        >
                            <motion.h1
                                className="font-display text-2xl md:text-3xl font-bold gradient-text"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
                            >
                                ORBIT SaaS
                            </motion.h1>
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            className="mt-2 text-sm md:text-base text-muted-foreground"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.3 }}
                        >
                            Elevating Your Digital Presence
                        </motion.p>

                        {/* Loading bar - simple CSS animation */}
                        <motion.div
                            className="mt-8 w-32 h-1 bg-muted/30 rounded-full overflow-hidden"
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                        >
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ delay: 0.5, duration: 1.1, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
