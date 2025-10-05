import { Activity } from "lucide-react";

interface ProgressTrackerProps {
  unlockedCount: number;
  totalRooms: number;
}

export const ProgressTracker = ({ unlockedCount, totalRooms }: ProgressTrackerProps) => {
  const percentage = (unlockedCount / totalRooms) * 100;

  return (
    <div className="terminal-border p-4 rounded-lg glow-cyan max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          <span className="text-sm font-mono text-accent font-bold tracking-wider">
            MISSION PROGRESS
          </span>
        </div>
        <span className="text-sm font-mono text-foreground font-bold">
          {unlockedCount}/{totalRooms}
        </span>
      </div>

      <div className="w-full bg-input rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-success to-accent transition-all duration-500 relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 animate-pulse-glow bg-success/50" />
        </div>
      </div>

      <div className="mt-2 text-xs text-muted-foreground font-mono text-center">
        {percentage === 100 
          ? "ALL SYSTEMS COMPROMISED ✓" 
          : `${Math.round(percentage)}% COMPLETE`}
      </div>
    </div>
  );
};
