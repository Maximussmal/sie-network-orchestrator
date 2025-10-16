import { Sparkles } from "lucide-react";

interface AIHandleProps {
  onOpen: () => void;
}

export const AIHandle = ({ onOpen }: AIHandleProps) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-0 left-0 right-0 h-16 bg-primary border-t-2 border-primary-foreground/10 cursor-pointer flex items-center justify-between px-6 transition-all hover:h-18 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
        </div>
        <div className="text-left">
          <p className="text-base font-bold text-primary-foreground">SIE</p>
          <p className="text-xs text-primary-foreground/70">Orchestrate Everything</p>
        </div>
      </div>
      <div className="text-sm text-primary-foreground/70 font-medium">
        Tap to open
      </div>
    </button>
  );
};
