import { useState } from "react";
import { Users, MessageCircle, Bot, Sparkles } from "lucide-react";
import { LandingAnimation } from "@/components/LandingAnimation";
import { NetworkInterface } from "@/components/NetworkInterface";
import { CommunicationHub } from "@/components/CommunicationHub";
import { AgentsHub } from "@/components/AgentsHub";
import { AIAssistant } from "@/components/AIAssistant";

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<"network" | "communication" | "agents">("network");
  const [isAIOpen, setIsAIOpen] = useState(false);

  if (showLanding) {
    return <LandingAnimation onComplete={() => setShowLanding(false)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-card/50 backdrop-blur-sm border-b border-border/50">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome Gil</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent shadow-[0_0_20px_rgba(127,194,161,0.6)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">SIE</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden pb-32">
        {activeTab === "network" ? (
          <NetworkInterface />
        ) : activeTab === "communication" ? (
          <CommunicationHub />
        ) : (
          <AgentsHub />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 z-40">
        <div className="flex items-center justify-around py-4">
          <button
            onClick={() => setActiveTab("network")}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "network"
                ? "text-white"
                : "text-white/60"
            }`}
          >
            <Users className={`w-6 h-6 ${activeTab === "network" ? "scale-110" : ""}`} />
          </button>
          <button
            onClick={() => setActiveTab("communication")}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "communication"
                ? "text-white"
                : "text-white/60"
            }`}
          >
            <MessageCircle className={`w-6 h-6 ${activeTab === "communication" ? "scale-110" : ""}`} />
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === "agents"
                ? "text-white"
                : "text-white/60"
            }`}
          >
            <Bot className={`w-6 h-6 ${activeTab === "agents" ? "scale-110" : ""}`} />
          </button>
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex flex-col items-center gap-1 transition-all text-accent"
          >
            <Sparkles className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

export default Index;
