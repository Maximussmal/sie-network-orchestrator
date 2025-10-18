import { useState } from "react";
import { Users, MessageCircle, Bot, Sparkles, ArrowLeft, Mail, CalendarIcon, Network, TrendingUp, Calendar, Lightbulb, Heart, UserPlus, MessageSquare, CalendarCheck } from "lucide-react";
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
  const [activeSection, setActiveSection] = useState<"network" | "communication" | "agents" | null>(null);
  
  // Sub-tabs for each section
  const [networkSubTab, setNetworkSubTab] = useState<"nurture" | "expand" | "signals">("nurture");
  const [communicationSubTab, setCommunicationSubTab] = useState<"email" | "messages" | "calendar">("email");
  const [agentsSubTab, setAgentsSubTab] = useState<"scheduling" | "insight">("scheduling");
  
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
        }}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      
      {/* Content */}
      <div className="flex-1 overflow-hidden pb-20">
        {activeSection === "network" ? (
          <NetworkInterface activeSection={networkSubTab} onSectionChange={setNetworkSubTab} />
        ) : activeSection === "communication" ? (
          <CommunicationHub activeSection={communicationSubTab} onSectionChange={setCommunicationSubTab} />
        ) : (
          <AgentsHub />
        )}
      </div>

      {/* Bottom navigation bar */}
      <div className="fixed bottom-4 left-4 right-4 bg-black rounded-3xl border border-white/10 z-40 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-2">
          {/* Back arrow */}
          <button
            onClick={() => {
              setShowMenu(true);
              setActiveSection(null);
            }}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
            
            {/* Sub-tabs for active section */}
            {activeSection === "network" && (
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-3 py-1">
                <button
                  onClick={() => setNetworkSubTab("nurture")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                    networkSubTab === "nurture" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Heart className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setNetworkSubTab("expand")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                    networkSubTab === "expand" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setNetworkSubTab("signals")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                    networkSubTab === "signals" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {activeSection === "communication" && (
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-3 py-1">
                <button
                  onClick={() => setCommunicationSubTab("email")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                    communicationSubTab === "email" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCommunicationSubTab("messages")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                    communicationSubTab === "messages" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCommunicationSubTab("calendar")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                    communicationSubTab === "calendar" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {activeSection === "agents" && (
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-3 py-1">
                <button
                  onClick={() => setAgentsSubTab("scheduling")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                    agentsSubTab === "scheduling" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAgentsSubTab("insight")}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                    agentsSubTab === "insight" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {/* Glowing SIE icon */}
            <button onClick={() => setIsAIOpen(true)} className="relative group">
              {/* Multi-layer glow effect */}
              <div className="absolute inset-0 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-accent/50 blur-xl" />
              </div>
              <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <div className="w-12 h-12 rounded-full bg-accent/40 blur-lg" />
              </div>
              <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '1s' }}>
                <div className="w-12 h-12 rounded-full bg-white/30 blur-md" />
              </div>
              {/* Icon */}
              <img 
                src={sumbiosIcon} 
                alt="SIE" 
                className="relative w-10 h-10 object-contain animate-[pulse_2s_ease-in-out_infinite] group-hover:scale-110 transition-transform drop-shadow-[0_0_12px_rgba(127,194,161,0.8)]" 
              />
            </button>
          </div>
        </div>

      {/* AI Assistant */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

export default Index;
