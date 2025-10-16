import { useState } from "react";
import { Users, MessageCircle, Bot } from "lucide-react";
import { LandingAnimation } from "@/components/LandingAnimation";
import { NetworkInterface } from "@/components/NetworkInterface";
import { CommunicationHub } from "@/components/CommunicationHub";
import { AgentsHub } from "@/components/AgentsHub";
import { AIAssistant } from "@/components/AIAssistant";
import { AIHandle } from "@/components/AIHandle";

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<"network" | "communication" | "agents">("network");
  const [isAIOpen, setIsAIOpen] = useState(false);

  if (showLanding) {
    return <LandingAnimation onComplete={() => setShowLanding(false)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">

      {/* Tab Navigation */}
      <div className="flex border-b border-border bg-card">
        <button
          onClick={() => setActiveTab("network")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-colors ${
            activeTab === "network"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          <Users className="w-4 h-4" />
          Network
        </button>
        <button
          onClick={() => setActiveTab("communication")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-colors ${
            activeTab === "communication"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Communication
        </button>
        <button
          onClick={() => setActiveTab("agents")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-colors ${
            activeTab === "agents"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          <Bot className="w-4 h-4" />
          Agents
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden pb-16">
        {activeTab === "network" ? (
          <NetworkInterface />
        ) : activeTab === "communication" ? (
          <CommunicationHub />
        ) : (
          <AgentsHub />
        )}
      </div>

      {/* AI Components */}
      <AIHandle onOpen={() => setIsAIOpen(true)} />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

export default Index;
