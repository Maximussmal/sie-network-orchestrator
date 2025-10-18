import { LayoutDashboard, Users, MessageCircle, Bot } from "lucide-react";
import sumbiosIcon from "@/assets/sumbios-icon.png";
import dashboardBg from "@/assets/menu-dashboard.jpg";
import networkBg from "@/assets/menu-network.jpg";
import communicateBg from "@/assets/menu-communicate.jpg";
import orchestrateBg from "@/assets/menu-orchestrate.jpg";

interface MenuSelectionProps {
  onSelect: (section: "dashboard" | "network" | "communication" | "agents") => void;
}

export const MenuSelection = ({ onSelect }: MenuSelectionProps) => {
  const menuItems = [
    { id: "dashboard" as const, title: "Dashboard", icon: LayoutDashboard, bg: dashboardBg },
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

      {/* Menu List - Vertical Stack */}
      <div className="flex flex-col h-full w-full relative z-10">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="relative group flex-1 border-b border-border/50 hover:border-accent/50 transition-all duration-300 overflow-hidden"
          >
            {/* Background Image - Full opacity with gradient mask for merging */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src={item.bg} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              {/* Gradient masks for merging bottom-left to top-right */}
              {index < menuItems.length - 1 && (
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/20"
                  style={{
                    maskImage: "linear-gradient(to top right, transparent 0%, black 50%)",
                    WebkitMaskImage: "linear-gradient(to top right, transparent 0%, black 50%)",
                  }}
                />
              )}
              {index > 0 && (
                <div 
                  className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black/20"
                  style={{
                    maskImage: "linear-gradient(to bottom left, transparent 0%, black 50%)",
                    WebkitMaskImage: "linear-gradient(to bottom left, transparent 0%, black 50%)",
                  }}
                />
              )}
            </div>
            
            {/* Content - Only Icon */}
            <div className="relative h-full flex items-center justify-center p-8">
              <item.icon className="w-16 h-16 text-white drop-shadow-2xl group-hover:scale-110 transition-all duration-300" />
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/50 transition-all duration-300" />
          </button>
        ))}
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
