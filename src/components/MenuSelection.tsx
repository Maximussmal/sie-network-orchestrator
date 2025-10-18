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

      {/* Menu List - Vertical Stack with Wavy Transitions */}
      <div className="flex flex-col h-full w-full relative z-10">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="relative group flex-1 transition-all duration-300 overflow-hidden"
            style={{
              clipPath: index === 0 
                ? "polygon(0 0, 100% 0, 100% 95%, 80% 100%, 60% 95%, 40% 100%, 20% 95%, 0 100%)"
                : index === menuItems.length - 1
                ? "polygon(0 5%, 20% 0, 40% 5%, 60% 0, 80% 5%, 100% 0, 100% 100%, 0 100%)"
                : "polygon(0 5%, 20% 0, 40% 5%, 60% 0, 80% 5%, 100% 0, 100% 95%, 80% 100%, 60% 95%, 40% 100%, 20% 95%, 0 100%)"
            }}
          >
            {/* Background Image with wavy blend */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src={item.bg} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              {/* Wavy overlay blend */}
              <div 
                className="absolute inset-0"
                style={{
                  background: index % 2 === 0
                    ? "linear-gradient(135deg, transparent 0%, rgba(127,194,161,0.1) 50%, transparent 100%)"
                    : "linear-gradient(225deg, transparent 0%, rgba(255,202,132,0.1) 50%, transparent 100%)"
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
