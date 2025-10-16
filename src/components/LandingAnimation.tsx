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
    const timer4 = setTimeout(() => setStage("opening"), 5000);
    const timer5 = setTimeout(() => {
      setStage("complete");
      onComplete();
    }, 6500);

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
      transition={{ duration: 0.8, delay: stage === "opening" ? 1 : 0 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Sphere - expands and moves to create opening */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: stage === "opening" ? 3 : 1,
            opacity: stage === "opening" ? 0.3 : 1,
            x: 0,
            y: 0
          }}
          transition={{ 
            duration: stage === "opening" ? 1.2 : 0.6, 
            delay: 0.5,
            ease: "easeInOut"
          }}
          className="absolute"
          style={{ 
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(190,100%,17%,0.6)] to-[hsl(46,93%,45%,0.4)] sphere-pulse ai-glow" />
        </motion.div>

        {/* Network lines container */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Inner network lines radiating from center */}
          {(stage === "network" || stage === "structure" || stage === "opening") && (
            <>
              {[...Array(8)].map((_, i) => {
                const angle = (i * Math.PI * 2) / 8 + (i % 2 === 0 ? 0.2 : -0.15);
                
                // Starting position (close to center)
                const startDistance = 15;
                const startX = 50 + Math.cos(angle) * startDistance;
                const startY = 40 + Math.sin(angle) * startDistance;
                
                // Middle position (medium distance)
                const midDistance = 25;
                const midX = 50 + Math.cos(angle) * midDistance;
                const midY = 40 + Math.sin(angle) * midDistance;
                
                // Opening position (extends to edges)
                const edgeDistance = stage === "opening" ? 70 : midDistance;
                const endX = 50 + Math.cos(angle) * edgeDistance;
                const endY = 40 + Math.sin(angle) * edgeDistance;
                
                return (
                  <g key={`line-${i}`}>
                    {/* Line from center to node */}
                    <motion.line
                      x1="50"
                      y1="40"
                      x2={stage === "opening" ? endX : midX}
                      y2={stage === "opening" ? endY : midY}
                      stroke="hsl(190, 100%, 17%)"
                      strokeWidth={stage === "opening" ? "0.15" : "0.3"}
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: 1, 
                        opacity: stage === "opening" ? 0.4 : 1 
                      }}
                      transition={{ 
                        duration: stage === "opening" ? 1.2 : 0.5, 
                        delay: i * 0.08,
                        ease: "easeInOut"
                      }}
                    />
                    {/* Node at end of line */}
                    <motion.circle
                      cx={stage === "opening" ? endX : midX}
                      cy={stage === "opening" ? endY : midY}
                      r={stage === "opening" ? "0.3" : "0.6"}
                      fill="hsl(46, 93%, 45%)"
                      vectorEffect="non-scaling-stroke"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: stage === "opening" ? 0.5 : 1 
                      }}
                      transition={{ 
                        duration: stage === "opening" ? 1.2 : 0.3, 
                        delay: 0.4 + i * 0.08,
                        ease: "easeInOut"
                      }}
                    />
                  </g>
                );
              })}
              
              {/* Connections between nodes */}
              {(stage === "network" || stage === "structure" || stage === "opening") && connections.map(([from, to], idx) => {
                const angle1 = (from * Math.PI * 2) / 8 + (from % 2 === 0 ? 0.2 : -0.15);
                const angle2 = (to * Math.PI * 2) / 8 + (to % 2 === 0 ? 0.2 : -0.15);
                
                const distance = stage === "opening" ? 70 : 25;
                const x1 = 50 + Math.cos(angle1) * distance;
                const y1 = 40 + Math.sin(angle1) * distance;
                const x2 = 50 + Math.cos(angle2) * distance;
                const y2 = 40 + Math.sin(angle2) * distance;
                
                return (
                  <motion.line
                    key={`connection-${idx}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="hsl(46, 93%, 45%)"
                    strokeWidth={stage === "opening" ? "0.08" : "0.15"}
                    strokeOpacity={stage === "opening" ? 0.2 : 0.4}
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: stage === "opening" ? 0.2 : 0.4 
                    }}
                    transition={{ 
                      duration: stage === "opening" ? 1.2 : 0.4, 
                      delay: 1 + idx * 0.05,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </>
          )}
          
          {/* Expanding outer network */}
          {(stage === "structure" || stage === "opening") && (
            <>
              {[...Array(16)].map((_, i) => {
                const angle = (i * Math.PI * 2) / 16 + Math.random() * 0.2;
                const startDistance = 35;
                const endDistance = stage === "opening" ? 95 : 50;
                
                const x = 50 + Math.cos(angle) * endDistance;
                const y = 40 + Math.sin(angle) * endDistance;
                
                return (
                  <g key={`outer-${i}`}>
                    <motion.line
                      x1="50"
                      y1="40"
                      x2={x}
                      y2={y}
                      stroke="hsl(190, 100%, 17%)"
                      strokeWidth="0.1"
                      strokeOpacity="0.2"
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: 1, 
                        opacity: stage === "opening" ? 0.3 : 0.2 
                      }}
                      transition={{ 
                        duration: stage === "opening" ? 1.2 : 0.6, 
                        delay: i * 0.02,
                        ease: "easeOut"
                      }}
                    />
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="0.25"
                      fill="hsl(46, 93%, 45%)"
                      fillOpacity="0.5"
                      vectorEffect="non-scaling-stroke"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: stage === "opening" ? 0.4 : 0.5 
                      }}
                      transition={{ 
                        duration: stage === "opening" ? 1.2 : 0.3, 
                        delay: 0.6 + i * 0.02,
                        ease: "easeOut"
                      }}
                    />
                  </g>
                );
              })}
            </>
          )}
        </svg>

        {/* Sumbios text - moves down and fades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: stage === "opening" ? 0 : 1, 
            y: stage === "opening" ? 100 : 0
          }}
          transition={{ 
            duration: 0.6,
            ease: "easeInOut"
          }}
          className="absolute text-center"
          style={{ top: '60%', left: '50%', transform: 'translateX(-50%)' }}
        >
          <h1 className="text-5xl font-bold text-[hsl(46,93%,45%)] mb-2">
            Sumbios
          </h1>
          <p className="text-muted-foreground">Intelligence Engine</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
