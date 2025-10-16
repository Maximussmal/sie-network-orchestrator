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
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Network visualization - positioned above text */}
        <div className="absolute" style={{ top: '30%', transform: 'translateY(-50%)' }}>
          {/* Sphere - appears first and stays */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(190,100%,17%,0.6)] to-[hsl(46,93%,45%,0.4)] sphere-pulse ai-glow" />
            
            {/* Inner network lines - stay contained */}
            {(stage === "network" || stage === "structure") && (
              <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                   style={{ width: '400px', height: '400px' }} 
                   viewBox="0 0 400 400">
                {[...Array(8)].map((_, i) => {
                  const angle = (i * Math.PI * 2) / 8 + (i % 2 === 0 ? 0.2 : -0.15);
                  const distance = 110 + (i % 3) * 15;
                  const x = 200 + Math.cos(angle) * distance;
                  const y = 200 + Math.sin(angle) * distance;
                  return (
                    <g key={`inner-${i}`}>
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
                        r="5"
                        fill="hsl(46, 93%, 45%)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                      />
                    </g>
                  );
                })}
                
                {/* Connections between nodes */}
                {stage === "network" && connections.map(([from, to], idx) => {
                  const angle1 = (from * Math.PI * 2) / 8 + (from % 2 === 0 ? 0.2 : -0.15);
                  const distance1 = 110 + (from % 3) * 15;
                  const x1 = 200 + Math.cos(angle1) * distance1;
                  const y1 = 200 + Math.sin(angle1) * distance1;
                  
                  const angle2 = (to * Math.PI * 2) / 8 + (to % 2 === 0 ? 0.2 : -0.15);
                  const distance2 = 110 + (to % 3) * 15;
                  const x2 = 200 + Math.cos(angle2) * distance2;
                  const y2 = 200 + Math.sin(angle2) * distance2;
                  
                  return (
                    <motion.line
                      key={`connection-${idx}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="hsl(46, 93%, 45%)"
                      strokeWidth="1"
                      strokeOpacity="0.3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 1 + idx * 0.05 }}
                    />
                  );
                })}
              </svg>
            )}

            {/* Expanding outer network - goes beyond screen */}
            {stage === "structure" && (
              <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                   style={{ width: '200vw', height: '200vh' }} 
                   viewBox="0 0 2000 2000">
                {[...Array(20)].map((_, i) => {
                  const angle = (i * Math.PI * 2) / 20 + Math.random() * 0.3;
                  const distance = 300 + Math.random() * 600;
                  const x = 1000 + Math.cos(angle) * distance;
                  const y = 1000 + Math.sin(angle) * distance;
                  return (
                    <g key={`outer-${i}`}>
                      <motion.line
                        x1="1000"
                        y1="1000"
                        x2={x}
                        y2={y}
                        stroke="hsl(190, 100%, 17%)"
                        strokeWidth="1"
                        strokeOpacity="0.2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: i * 0.03 }}
                      />
                      <motion.circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="hsl(46, 93%, 45%)"
                        fillOpacity="0.4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 + i * 0.03 }}
                      />
                    </g>
                  );
                })}
                
                {/* Random connections in outer network */}
                {[...Array(15)].map((_, i) => {
                  const from = Math.floor(Math.random() * 20);
                  const to = Math.floor(Math.random() * 20);
                  if (from === to) return null;
                  
                  const angle1 = (from * Math.PI * 2) / 20 + Math.random() * 0.3;
                  const distance1 = 300 + Math.random() * 600;
                  const x1 = 1000 + Math.cos(angle1) * distance1;
                  const y1 = 1000 + Math.sin(angle1) * distance1;
                  
                  const angle2 = (to * Math.PI * 2) / 20 + Math.random() * 0.3;
                  const distance2 = 300 + Math.random() * 600;
                  const x2 = 1000 + Math.cos(angle2) * distance2;
                  const y2 = 1000 + Math.sin(angle2) * distance2;
                  
                  return (
                    <motion.line
                      key={`outer-connection-${i}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="hsl(46, 93%, 45%)"
                      strokeWidth="1"
                      strokeOpacity="0.15"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 + i * 0.04 }}
                    />
                  );
                })}
              </svg>
            )}
          </motion.div>
        </div>

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
