import { LayoutDashboard, Users, MessageCircle, Bot, Lightbulb } from "lucide-react";
import sumbiosIcon from "@/assets/sumbios-icon.png";
import dashboardBg from "@/assets/menu-dashboard.jpg";
import networkBg from "@/assets/menu-network.jpg";
import communicateBg from "@/assets/menu-communicate.jpg";
import orchestrateBg from "@/assets/menu-orchestrate.jpg";
import sunBg from "@/assets/menu-feedback-sun.jpg";

interface MenuSelectionProps {
  onSelect: (section: "network" | "communication" | "agents" | "feedback") => void;
}

export const MenuSelection = ({ onSelect }: MenuSelectionProps) => {
  const menuItems = [
    { id: "network" as const, title: "Network", icon: Users, bg: networkBg },
    { id: "communication" as const, title: "Communicate", icon: MessageCircle, bg: communicateBg },
    { id: "agents" as const, title: "Orchestrate", icon: Bot, bg: orchestrateBg },
  ];

  return (
    <div className="h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Menu List - Seamless Symbiotic Vertical Stack */}
      <div className="flex flex-col h-full w-full relative z-10">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="relative group transition-all duration-300 overflow-visible"
            style={{
              height: '30%',
              clipPath: index === 0 
                ? "polygon(0 0, 100% 0, 100% 100%, 80% 105%, 60% 100%, 40% 105%, 20% 100%, 0 105%)"
                : index === menuItems.length - 1
                ? "polygon(0 -5%, 20% 0, 40% -5%, 60% 0, 80% -5%, 100% 0, 100% 100%, 80% 105%, 60% 100%, 40% 105%, 20% 100%, 0 105%)"
                : "polygon(0 -5%, 20% 0, 40% -5%, 60% 0, 80% -5%, 100% 0, 100% 100%, 80% 105%, 60% 100%, 40% 105%, 20% 100%, 0 105%)"
            }}
          >
            {/* Background Image with seamless blend */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src={item.bg} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                style={{
                  filter: "brightness(0.95)"
                }}
              />
              {/* Seamless gradient overlay for symbiotic merging */}
              <div 
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(127,194,161,0.05) 0%, transparent 40%, transparent 60%, rgba(255,202,132,0.05) 100%)",
                  mixBlendMode: "soft-light"
                }}
              />
            </div>
            
            {/* Content - Icon with enhanced glow */}
            <div className="relative h-full flex items-center justify-center p-8">
              <div className="relative">
                <div className="absolute inset-0 blur-xl bg-accent/30 group-hover:bg-accent/50 transition-all duration-300" />
                <item.icon className="relative w-16 h-16 text-white drop-shadow-2xl group-hover:scale-110 transition-all duration-300" />
              </div>
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/50 transition-all duration-300" />
          </button>
        ))}

        {/* Feedback/Collaborate Section - Sun with Lightbulb */}
        <button
          onClick={() => onSelect("feedback")}
          className="relative group transition-all duration-300 overflow-visible"
          style={{
            height: '10%',
            clipPath: "polygon(0 -5%, 20% 0, 40% -5%, 60% 0, 80% -5%, 100% 0, 100% 100%, 0 100%)"
          }}
        >
          {/* Sun image background */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={sunBg} 
              alt="Connect"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          {/* Lightbulb in center */}
          <div className="relative h-full flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-white/50 group-hover:bg-white/70 transition-all duration-300 animate-pulse" />
              <Lightbulb className="relative w-12 h-12 text-white drop-shadow-2xl group-hover:scale-110 transition-all duration-300" fill="currentColor" />
            </div>
          </div>

          {/* Hover border glow */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 transition-all duration-300" />
        </button>
      </div>

      {/* Glowing SIE icon bottom right */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          {/* Multi-layer glow effect */}
          <div className="absolute inset-0 animate-pulse">
            <div className="w-20 h-20 rounded-full bg-accent/50 blur-2xl" />
          </div>
          <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <div className="w-20 h-20 rounded-full bg-accent/40 blur-xl" />
          </div>
          <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '1s' }}>
            <div className="w-20 h-20 rounded-full bg-white/30 blur-lg" />
          </div>
          {/* Icon */}
          <img 
            src={sumbiosIcon} 
            alt="SIE" 
            className="relative w-16 h-16 object-contain animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_15px_rgba(127,194,161,0.8)]" 
          />
        </div>
      </div>
    </div>
  );
};
