import { useState } from "react";
import { Users, ArrowRight, Terminal } from "lucide-react";
import { supabaseDb } from "@/utils/supabaseDB";

interface TeamOnboardingProps {
  isOpen: boolean;
  onComplete: (teamName: string, teamId: string) => void;
}

export const TeamOnboarding = ({ isOpen, onComplete }: TeamOnboardingProps) => {
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const trimmedName = teamName.trim();

    if (!trimmedName) {
      setError("Team name cannot be empty");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (trimmedName.length < 3) {
      setError("Team name must be at least 3 characters");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (trimmedName.length > 50) {
      setError("Team name must be less than 50 characters");
      setTimeout(() => setError(""), 2000);
      return;
    }

    setLoading(true);

    try {
      // Generate a unique team ID
      const teamId = `team:${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Initialize team data
      const teamData = {
        teamId,
        teamName: trimmedName,
        unlockedRooms: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      // Save to Supabase (shared across all devices)
      await supabaseDb.saveTeam(teamData);

      // Also store in localStorage for offline capability
      localStorage.setItem(teamId, JSON.stringify(teamData));
      localStorage.setItem("currentTeamId", teamId);
      localStorage.setItem("currentTeamName", trimmedName);

      onComplete(trimmedName, teamId);
    } catch (err) {
      console.error("Error registering team:", err);
      setError("Registration error. Please try again.");
      setTimeout(() => setError(""), 2000);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="terminal-border p-8 glow-red">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-8 h-8 text-accent animate-pulse-glow" />
            <h2 className="text-2xl md:text-3xl font-bold text-accent font-mono text-center">
              TEAM REGISTRATION
            </h2>
          </div>

          <div className="terminal-border p-4 mb-6 glow-green">
            <div className="flex items-start gap-2">
              <Terminal className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
              <div className="text-sm text-muted-foreground font-mono space-y-1">
                <p>&gt; Welcome to the Relay Coding Challenge</p>
                <p>&gt; Enter your team name to begin</p>
                <p>&gt; Your progress will be tracked automatically</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-accent font-mono text-sm mb-2">
                &gt; TEAM NAME
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-black border-2 border-accent text-accent font-mono px-4 py-3 focus:outline-none focus:border-destructive text-lg"
                placeholder="Enter your team name..."
                maxLength={50}
                disabled={loading}
                autoFocus
              />
              <div className="text-xs text-muted-foreground font-mono mt-1">
                {teamName.length}/50 characters
              </div>
            </div>

            {error && (
              <div className="terminal-border p-3 glow-red">
                <div className="text-destructive font-mono text-sm text-center animate-pulse">
                  ERROR: {error}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !teamName.trim()}
              className="w-full bg-accent text-black font-bold py-4 font-mono hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  REGISTERING...
                </>
              ) : (
                <>
                  START CHALLENGE
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground font-mono">
            Your team progress will be shared across all devices
          </div>
        </div>
      </div>
    </div>
  );
};
