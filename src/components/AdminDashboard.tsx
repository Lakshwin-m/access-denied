import { useState, useEffect } from "react";
import { Shield, Users, RefreshCw, X } from "lucide-react";
import { supabaseDb } from "@/utils/supabaseDB";

const ADMIN_PASSWORD = "admin2024";

export const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      loadTeams();
    } else {
      setError("Invalid password");
      setTimeout(() => setError(""), 2000);
    }
  };

  const loadTeams = async () => {
    setLoading(true);
    try {
      // Get teams from Supabase (shared across all devices)
      const teamsData = await supabaseDb.getTeams();
      setTeams(teamsData);
    } catch (err) {
      console.error("Error loading teams:", err);
      setError("Failed to load teams from server");
      setTimeout(() => setError(""), 2000);

      // Fallback to localStorage if Supabase fails
      try {
        const allTeams: any[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("team:")) {
            try {
              const data = localStorage.getItem(key);
              if (data) {
                const teamData = JSON.parse(data);
                allTeams.push(teamData);
              }
            } catch (err) {
              console.error(`Error loading team ${key}:`, err);
            }
          }
        }
        const sortedTeams = allTeams.sort(
          (a, b) => b.unlockedRooms.length - a.unlockedRooms.length
        );
        setTeams(sortedTeams);
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
      }
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    loadTeams();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setTeams([]);
  };

  // Real-time updates and auto-refresh
  useEffect(() => {
    if (isAuthenticated) {
      loadTeams();

      // Subscribe to real-time updates
      const subscription = supabaseDb.subscribeToTeams((updatedTeams) => {
        setTeams(updatedTeams);
      });

      // Also auto-refresh every 10 seconds as backup
      const interval = setInterval(loadTeams, 10000);

      return () => {
        subscription?.unsubscribe();
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="terminal-border p-8 glow-red">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-destructive" />
              <h1 className="text-2xl font-bold text-destructive font-mono">
                ADMIN ACCESS
              </h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-accent font-mono text-sm mb-2">
                  &gt; ENTER PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border-2 border-accent text-accent font-mono px-4 py-2 focus:outline-none focus:border-destructive"
                  placeholder="••••••••"
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-destructive font-mono text-sm text-center animate-pulse">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-destructive text-black font-bold py-3 font-mono hover:bg-red-600 transition-colors"
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-accent p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-destructive" />
            <h1 className="text-3xl font-bold text-destructive font-mono">
              TEAM PROGRESS MONITOR
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-accent text-black px-4 py-2 font-mono hover:bg-green-400 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              REFRESH
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-destructive text-black px-4 py-2 font-mono hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
              LOGOUT
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="terminal-border p-4 glow-green">
            <div className="text-sm text-muted-foreground font-mono mb-1">
              TOTAL TEAMS
            </div>
            <div className="text-3xl font-bold text-accent font-mono">
              {teams.length}
            </div>
          </div>
          <div className="terminal-border p-4 glow-green">
            <div className="text-sm text-muted-foreground font-mono mb-1">
              COMPLETED (14/14)
            </div>
            <div className="text-3xl font-bold text-accent font-mono">
              {teams.filter((t) => t.unlockedRooms.length === 14).length}
            </div>
          </div>
          <div className="terminal-border p-4 glow-green">
            <div className="text-sm text-muted-foreground font-mono mb-1">
              AVG PROGRESS
            </div>
            <div className="text-3xl font-bold text-accent font-mono">
              {teams.length > 0
                ? Math.round(
                    teams.reduce((sum, t) => sum + t.unlockedRooms.length, 0) /
                      teams.length
                  )
                : 0}
              /14
            </div>
          </div>
        </div>

        {/* Teams List */}
        <div className="terminal-border p-6 glow-red">
          <h2 className="text-xl font-bold text-destructive font-mono mb-4">
            &gt; TEAM LEADERBOARD
          </h2>

          {loading && teams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground font-mono">
              Loading teams...
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground font-mono">
              No teams registered yet
            </div>
          ) : (
            <div className="space-y-3">
              {teams.map((team, index) => (
                <div
                  key={team.teamId}
                  className="bg-black border-2 border-accent p-4 hover:border-destructive transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-destructive font-mono">
                        #{index + 1}
                      </span>
                      <span className="text-lg font-bold text-accent font-mono">
                        {team.teamName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-accent font-mono">
                        {team.unlockedRooms.length}/14
                      </span>
                      {team.unlockedRooms.length === 14 && (
                        <Shield className="w-5 h-5 text-destructive animate-pulse-glow" />
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-900 h-2 mb-2">
                    <div
                      className="bg-accent h-full transition-all duration-500"
                      style={{
                        width: `${(team.unlockedRooms.length / 14) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Room Grid */}
                  <div className="flex gap-1 flex-wrap">
                    {Array.from({ length: 14 }, (_, i) => i + 1).map(
                      (roomNum) => (
                        <div
                          key={roomNum}
                          className={`w-8 h-8 flex items-center justify-center font-mono text-xs font-bold ${
                            team.unlockedRooms.includes(roomNum)
                              ? "bg-accent text-black"
                              : "bg-gray-900 text-gray-600"
                          }`}
                        >
                          {roomNum}
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground font-mono">
                    Last updated: {new Date(team.lastUpdated).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="mt-8 terminal-border p-4 glow-blue">
          <h3 className="text-lg font-mono mb-2">System Info</h3>
          <p className="text-sm font-mono">Teams found: {teams.length}</p>
          <p className="text-sm font-mono">
            Data Source: Supabase + Real-time Updates
          </p>
          <button
            onClick={() => {
              console.log("Teams data:", teams);
            }}
            className="mt-2 bg-blue-500 text-black px-3 py-1 font-mono text-sm"
          >
            Log Debug Info
          </button>
        </div>
      </div>
    </div>
  );
};
