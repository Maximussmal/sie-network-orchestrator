import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LandingAnimationProps {
  onComplete: () => void;
}

export const LandingAnimation = ({ onComplete }: LandingAnimationProps) => {
  const [stage, setStage] = useState<"text" | "sphere" | "network" | "structure" | "opening" | "complete">("text");

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("sphere"), 1000);
    const timer2 = setTimeout(() => setStage("network"), 2000);
    const timer3 = setTimeout(() => setStage("structure"), 3500);
    const timer4 = setTimeout(() => setStage("opening"), 4500);
    const timer5 = setTimeout(() => {
      setStage("complete");
      onComplete();
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  // Generate random connections between outer nodes
  const generateConnections = () => {
    const connections = [];
    for (let i = 0; i < 8; i++) {
      const numConnections = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numConnections; j++) {
        const target = (i + Math.floor(Math.random() * 4) + 2) % 8;
        if (target !== i) {
          connections.push([i, target]);
        }
      }
    }
    return connections;
  };

  const [connections] = useState(generateConnections());

  return (
    <motion.div 
      className="fixed inset-0 bg-background flex items-center justify-center z-50 overflow-hidden"
      animate={stage === "opening" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1, delay: stage === "opening" ? 0.5 : 0 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Network visualization */}
        <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {/* Sphere - appears first and expands */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: stage === "opening" ? 3 : 1, 
              opacity: stage === "opening" ? 0 : (stage === "structure" ? 0.8 : 1)
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-full bg-primary sphere-pulse ai-glow" />
            
            {/* Inner network lines */}
            {(stage === "network" || stage === "structure" || stage === "opening") && (
              <motion.svg 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                style={{ width: '100vw', height: '100vh' }} 
                viewBox="0 0 1000 1000"
                animate={stage === "opening" ? { scale: 10, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                {[...Array(12)].map((_, i) => {
                  const angle = (i * Math.PI * 2) / 12 + (i % 2 === 0 ? 0.2 : -0.15);
                  const distance = stage === "structure" || stage === "opening" ? 280 : 180;
                  const sphereRadius = 30; // Adjusted for SVG coordinate system
                  const x1 = 500 + Math.cos(angle) * sphereRadius;
                  const y1 = 500 + Math.sin(angle) * sphereRadius;
                  const x2 = 500 + Math.cos(angle) * distance;
                  const y2 = 500 + Math.sin(angle) * distance;
                  
                  return (
                    <g key={`inner-${i}`}>
                      <motion.line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="hsl(190 100% 17%)"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                      />
                      <motion.circle
                        cx={x2}
                        cy={y2}
                        r="6"
                        fill="hsl(46 93% 45%)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                      />
                    </g>
                  );
                })}
                
                {/* Connections between nodes */}
                {(stage === "structure" || stage === "opening") && connections.map(([from, to], idx) => {
                  const angle1 = (from * Math.PI * 2) / 12 + (from % 2 === 0 ? 0.2 : -0.15);
                  const distance = 280;
                  const x1 = 500 + Math.cos(angle1) * distance;
                  const y1 = 500 + Math.sin(angle1) * distance;
                  
                  const angle2 = (to * Math.PI * 2) / 12 + (to % 2 === 0 ? 0.2 : -0.15);
                  const x2 = 500 + Math.cos(angle2) * distance;
                  const y2 = 500 + Math.sin(angle2) * distance;
                  
                  return (
                    <motion.line
                      key={`connection-${idx}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="hsl(46 93% 45%)"
                      strokeWidth="1.5"
                      strokeOpacity="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 + idx * 0.05 }}
                    />
                  );
                })}
              </motion.svg>
            )}

          </motion.div>
        </div>

        {/* Sumbios text - fades out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: stage === "structure" ? 0 : (stage === "opening" ? 0 : 1), 
            y: stage === "structure" ? 50 : 0
          }}
          transition={{ duration: 0.8 }}
          className="text-center absolute"
          style={{ top: '60%' }}
        >
          <h1 className="text-5xl font-bold text-secondary mb-2">
            Sumbios
          </h1>
          <p className="text-muted-foreground">Intelligence Engine</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
