import { Sparkles } from "lucide-react";

interface AIHandleProps {
  onOpen: () => void;
}

export const AIHandle = ({ onOpen }: AIHandleProps) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-primary via-accent to-primary border-t-2 border-accent/30 cursor-pointer flex items-center justify-start px-6 transition-all hover:h-18 z-30 shadow-[0_-4px_20px_rgba(127,194,161,0.4)] rounded-t-3xl backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent shadow-[0_0_20px_rgba(127,194,161,0.6)] flex items-center justify-center animate-pulse">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
        </div>
        <div className="text-left">
          <p className="text-base font-bold text-primary-foreground">SIE</p>
          <p className="text-xs text-primary-foreground/80">Orchestrate Everything</p>
        </div>
      </div>
    </button>
  );
};
