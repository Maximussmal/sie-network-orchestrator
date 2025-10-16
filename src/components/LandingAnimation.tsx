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
            className="text-center max-w-screen-lg mx-auto px-8"
          >
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="logo logo-spin">
                <svg width="96" height="96" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="url(#gradient1)" strokeWidth="3" fill="none" />
                  <circle cx="50" cy="50" r="30" fill="url(#gradient2)" />
                  <defs>
                    <linearGradient id="gradient1" x1="0" y1="0" x2="100" y2="100">
                      <stop offset="0%" stopColor="hsl(190, 100%, 17%)" />
                      <stop offset="100%" stopColor="hsl(46, 93%, 45%)" />
                    </linearGradient>
                    <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="hsl(190, 100%, 17%)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="hsl(46, 93%, 45%)" stopOpacity="0.4" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[hsl(190,100%,17%)] to-[hsl(46,93%,45%)] bg-clip-text text-transparent mb-2">
              Sumbios
            </h1>
            <p className="text-muted-foreground">Intelligence Engine</p>
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
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(190,100%,17%,0.6)] to-[hsl(46,93%,45%,0.4)] sphere-pulse ai-glow" />
              
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
                          stroke="hsl(190, 100%, 17%)"
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                        <motion.circle
                          cx={x}
                          cy={y}
                          r="8"
                          fill="hsl(46, 93%, 45%)"
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
