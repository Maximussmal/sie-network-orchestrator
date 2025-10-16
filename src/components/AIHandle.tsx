import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

interface AIHandleProps {
  onOpen: () => void;
}

export const AIHandle = ({ onOpen }: AIHandleProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (handleRef.current?.contains(e.target as Node)) {
        setStartX(e.touches[0].clientX);
        setIsDragging(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        // If swiped left more than 50px, open the assistant
        if (diff > 50) {
          setIsDragging(false);
          onOpen();
        }
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startX, onOpen]);

  return (
    <>
      {/* Edge indicator */}
      <div className="fixed right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[hsl(var(--ai-blue)/0.3)] via-[hsl(var(--ai-purple)/0.3)] to-[hsl(var(--ai-blue)/0.3)] pointer-events-none" />
      
      {/* Floating AI Handle */}
      <div
        ref={handleRef}
        onClick={onOpen}
        className="fixed right-2 top-1/2 -translate-y-1/2 w-12 h-24 rounded-l-full bg-gradient-to-br from-[hsl(var(--ai-blue)/0.9)] to-[hsl(var(--ai-purple)/0.9)] backdrop-blur-sm ai-glow-strong cursor-pointer flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center sphere-pulse">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>
    </>
  );
};
