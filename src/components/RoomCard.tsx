import { Lock, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomCardProps {
  roomNumber: number;
  isUnlocked: boolean;
  onClick: () => void;
  roomTitle: string; // Now required since all rooms have titles
}

export const RoomCard = ({
  roomNumber,
  isUnlocked,
  onClick,
  roomTitle,
}: RoomCardProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`
        relative h-36 terminal-border transition-all duration-300
        hover:scale-105 hover:glow-cyan
        ${isUnlocked ? "glow-green border-success" : "border-border"}
        flex flex-col items-center justify-center gap-3
        group overflow-hidden p-4
      `}
    >
      <div className="scan-lines absolute inset-0 opacity-50" />

      <div className="relative z-10 flex flex-col items-center gap-3 w-full">
        {isUnlocked ? (
          <LockOpen
            className="w-6 h-6 text-success animate-unlock flex-shrink-0"
            strokeWidth={2}
          />
        ) : (
          <Lock
            className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0"
            strokeWidth={2}
          />
        )}

        <div className="text-center w-full">
          <div className="text-xs text-muted-foreground tracking-widest mb-1">
            {isUnlocked ? "ACCESS GRANTED" : "LOCKED"}
          </div>
          <div
            className={`text-sm font-bold leading-tight ${
              isUnlocked ? "text-success" : "text-foreground"
            }`}
          >
            {roomTitle}
          </div>
          <div className="text-xs text-muted-foreground mt-2 font-mono">
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
