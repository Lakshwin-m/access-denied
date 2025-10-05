import { Lock, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomCardProps {
  roomNumber: number;
  isUnlocked: boolean;
  onClick: () => void;
}

export const RoomCard = ({ roomNumber, isUnlocked, onClick }: RoomCardProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`
        relative h-32 terminal-border transition-all duration-300
        hover:scale-105 hover:glow-cyan
        ${isUnlocked ? "glow-green border-success" : "border-border"}
        flex flex-col items-center justify-center gap-3
        group overflow-hidden
      `}
    >
      <div className="scan-lines absolute inset-0 opacity-50" />
      
      <div className="relative z-10 flex flex-col items-center gap-3">
        {isUnlocked ? (
          <LockOpen 
            className="w-8 h-8 text-success animate-unlock" 
            strokeWidth={2}
          />
        ) : (
          <Lock 
            className="w-8 h-8 text-muted-foreground group-hover:text-accent transition-colors" 
            strokeWidth={2}
          />
        )}
        
        <div className="text-center">
          <div className="text-xs text-muted-foreground tracking-widest">
            {isUnlocked ? "ACCESS GRANTED" : "LOCKED"}
          </div>
          <div className={`text-lg font-bold tracking-wider ${
            isUnlocked ? "text-success" : "text-foreground"
          }`}>
            ROOM {roomNumber.toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      {isUnlocked && (
        <div className="absolute inset-0 bg-success/5 animate-pulse-glow" />
      )}
    </Button>
  );
};
