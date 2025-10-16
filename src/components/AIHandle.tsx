import { Sparkles } from "lucide-react";

interface AIHandleProps {
  onOpen: () => void;
}

export const AIHandle = ({ onOpen }: AIHandleProps) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(190,100%,17%)] to-[hsl(46,93%,45%)] ai-glow-strong cursor-pointer flex items-center gap-3 transition-all hover:scale-105 active:scale-95 z-30 shadow-lg"
    >
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center sphere-pulse">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="text-left">
        <p className="text-sm font-bold text-white">SIE</p>
        <p className="text-xs text-white/80">Orchestrate Everything</p>
      </div>
    </button>
  );
};
