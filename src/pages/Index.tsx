import { useState } from "react";
import { Users, MessageCircle, Bot, Sparkles, ArrowLeft } from "lucide-react";
import { LandingAnimation } from "@/components/LandingAnimation";
import { MenuSelection } from "@/components/MenuSelection";
import { NetworkInterface } from "@/components/NetworkInterface";
import { CommunicationHub } from "@/components/CommunicationHub";
import { AgentsHub } from "@/components/AgentsHub";
import { AIAssistant } from "@/components/AIAssistant";
import sumbiosIcon from "@/assets/sumbios-icon.png";

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [activeSection, setActiveSection] = useState<"dashboard" | "network" | "communication" | "agents" | null>(null);
  const [activeTab, setActiveTab] = useState<"network" | "communication" | "agents">("network");
  const [isAIOpen, setIsAIOpen] = useState(false);

  if (showLanding) {
    return <LandingAnimation onComplete={() => setShowLanding(false)} />;
  }

  if (showMenu) {
    return (
      <MenuSelection
        onSelect={(section) => {
          setActiveSection(section);
          setShowMenu(false);
          // Set the appropriate tab for non-dashboard sections
          if (section === "network") setActiveTab("network");
          else if (section === "communication") setActiveTab("communication");
          else if (section === "agents") setActiveTab("agents");
        }}
      />
    );
  }

  // If dashboard is selected, show the main view with all tabs
  const isDashboard = activeSection === "dashboard";

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      
      {/* Top Header - only show on dashboard */}
      {isDashboard && (
        <div className="flex items-center justify-between px-6 py-4 bg-card/50 backdrop-blur-sm border-b border-border/50">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Gil</h1>
          </div>
          <div className="flex items-center gap-3">
            <img src={sumbiosIcon} alt="SIE" className="w-10 h-10 object-contain" />
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">SIE</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 overflow-hidden ${isDashboard ? 'pb-32' : 'pb-24'}`}>
        {isDashboard ? (
          // Dashboard view - show current tab
          activeTab === "network" ? (
            <NetworkInterface />
          ) : activeTab === "communication" ? (
            <CommunicationHub />
          ) : (
            <AgentsHub />
          )
        ) : activeSection === "network" ? (
          <NetworkInterface />
        ) : activeSection === "communication" ? (
          <CommunicationHub />
        ) : (
          <AgentsHub />
        )}
      </div>

      {/* Bottom Navigation - only show on dashboard */}
      {isDashboard && (
        <div className="fixed bottom-4 left-4 right-4 bg-black rounded-3xl border border-white/10 z-40 shadow-2xl">
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
      )}

      {/* Bottom navigation bar for non-dashboard sections */}
      {!isDashboard && (
        <div className="fixed bottom-4 left-4 right-4 bg-black rounded-3xl border border-white/10 z-40 shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Back arrow */}
            <button
              onClick={() => {
                setShowMenu(true);
                setActiveSection(null);
              }}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            {/* Glowing SIE icon */}
            <button onClick={() => setIsAIOpen(true)} className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-accent/30 blur-xl" />
              </div>
              {/* Icon */}
              <img 
                src={sumbiosIcon} 
                alt="SIE" 
                className="relative w-12 h-12 object-contain animate-[pulse_3s_ease-in-out_infinite] group-hover:scale-110 transition-transform" 
              />
            </button>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

export default Index;
