import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LandingAnimationProps {
  onComplete: () => void;
}

export const LandingAnimation = ({ onComplete }: LandingAnimationProps) => {
  const [stage, setStage] = useState<"text" | "sphere" | "network" | "structure" | "complete">("text");

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("sphere"), 1000);
    const timer2 = setTimeout(() => setStage("network"), 2000);
    const timer3 = setTimeout(() => setStage("structure"), 3500);
    const timer4 = setTimeout(() => {
      setStage("complete");
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  const structures = ["city", "flowers", "infrastructure", "neural", "cosmic"];
  const randomStructure = structures[Math.floor(Math.random() * structures.length)];

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        {stage === "text" && (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[hsl(var(--ai-blue))] to-[hsl(var(--ai-purple))] bg-clip-text text-transparent">
              Sumbios
            </h1>
          </motion.div>
        )}

        {(stage === "sphere" || stage === "network" || stage === "structure") && (
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(var(--ai-blue)/0.6)] to-[hsl(var(--ai-purple)/0.4)] sphere-pulse ai-glow" />
              
              {stage === "network" && (
                <svg className="absolute inset-0 w-96 h-96 -translate-x-1/3 -translate-y-1/3" viewBox="0 0 400 400">
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * Math.PI * 2) / 8;
                    const x = 200 + Math.cos(angle) * 150;
                    const y = 200 + Math.sin(angle) * 150;
                    return (
                      <g key={i}>
                        <motion.line
                          x1="200"
                          y1="200"
                          x2={x}
                          y2={y}
                          stroke="hsl(var(--ai-blue))"
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                        <motion.circle
                          cx={x}
                          cy={y}
                          r="8"
                          fill="hsl(var(--ai-purple))"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                        />
                      </g>
                    );
                  })}
                </svg>
              )}

              {stage === "structure" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 w-96 h-96 -translate-x-1/3 -translate-y-1/3 flex items-center justify-center"
                >
                  <div className="text-8xl opacity-20">
                    {randomStructure === "city" && "🏙️"}
                    {randomStructure === "flowers" && "🌸"}
                    {randomStructure === "infrastructure" && "🏗️"}
                    {randomStructure === "neural" && "🧠"}
                    {randomStructure === "cosmic" && "🌌"}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
