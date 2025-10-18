import { LayoutDashboard, Users, MessageCircle, Bot } from "lucide-react";
import sumbiosIcon from "@/assets/sumbios-icon.png";

interface MenuSelectionProps {
  onSelect: (section: "dashboard" | "network" | "communication" | "agents") => void;
}

export const MenuSelection = ({ onSelect }: MenuSelectionProps) => {
  const menuItems = [
    { id: "dashboard" as const, title: "Dashboard", icon: LayoutDashboard, color: "from-blue-500/20 to-blue-600/20" },
    { id: "network" as const, title: "Network", icon: Users, color: "from-purple-500/20 to-purple-600/20" },
    { id: "communication" as const, title: "Communicate", icon: MessageCircle, color: "from-green-500/20 to-green-600/20" },
    { id: "agents" as const, title: "Orchestrate", icon: Bot, color: "from-orange-500/20 to-orange-600/20" },
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

      {/* Menu Grid */}
      <div className="grid grid-cols-2 grid-rows-2 h-full w-full gap-0 relative z-10">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`relative group border border-border/50 hover:border-accent/50 transition-all duration-300 overflow-hidden`}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center gap-4 p-8">
              <item.icon className="w-16 h-16 text-foreground/60 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
              <h2 className="text-3xl font-bold text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                {item.title}
              </h2>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 transition-all duration-300" />
          </button>
        ))}
      </div>

      {/* Glowing SIE icon bottom right */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-accent/30 blur-xl" />
          </div>
          {/* Icon */}
          <img 
            src={sumbiosIcon} 
            alt="SIE" 
            className="relative w-16 h-16 object-contain animate-[pulse_3s_ease-in-out_infinite]" 
          />
        </div>
      </div>
    </div>
  );
};
