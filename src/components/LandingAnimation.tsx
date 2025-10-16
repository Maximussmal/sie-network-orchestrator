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
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Sphere - appears first and stays */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(190,100%,17%,0.6)] to-[hsl(46,93%,45%,0.4)] sphere-pulse ai-glow" />
          
          {/* Network lines from sphere - appear second and stay */}
          {(stage === "network" || stage === "structure") && (
            <svg className="absolute inset-0 w-96 h-96 -translate-x-1/3 -translate-y-1/3 pointer-events-none" viewBox="0 0 400 400">
              {[...Array(8)].map((_, i) => {
                const angle = (i * Math.PI * 2) / 8 + (i % 2 === 0 ? 0.2 : -0.15);
                const distance = 130 + (i % 3) * 20;
                const x = 200 + Math.cos(angle) * distance;
                const y = 200 + Math.sin(angle) * distance;
                return (
                  <g key={i}>
                    <motion.line
                      x1="200"
                      y1="200"
                      x2={x}
                      y2={y}
                      stroke="hsl(190, 100%, 17%)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                    />
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="hsl(46, 93%, 45%)"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                    />
                  </g>
                );
              })}
            </svg>
          )}

          {/* Outer structure visualization - appears last */}
          {stage === "structure" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-[500px] h-[500px] -translate-x-[42%] -translate-y-[42%] flex items-center justify-center pointer-events-none"
            >
              <div className="text-9xl opacity-15">
                {randomStructure === "city" && "🏙️"}
                {randomStructure === "flowers" && "🌸"}
                {randomStructure === "infrastructure" && "🏗️"}
                {randomStructure === "neural" && "🧠"}
                {randomStructure === "cosmic" && "🌌"}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Sumbios text - stays visible throughout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-[hsl(46,93%,45%)] mb-2">
            Sumbios
          </h1>
          <p className="text-muted-foreground">Intelligence Engine</p>
        </motion.div>
      </div>
    </div>
  );
};
