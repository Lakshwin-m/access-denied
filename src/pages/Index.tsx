import { useState, useEffect } from "react";
import { Shield, Terminal } from "lucide-react";
import { TeamOnboarding } from "@/components/TeamOnboarding";
import { MatrixRain } from "@/components/MatrixRain";
import { RoomCard } from "@/components/RoomCard";
import { PasswordModal } from "@/components/PasswordModal";
import { ProgressTracker } from "@/components/ProgressTracker";
import { api } from "@/utils/api";

// Mock rooms data
import { rooms } from "@/data/rooms";

type ModalStatus = "idle" | "denied" | "granted";

const Index = () => {
  const [teamName, setTeamName] = useState<string>("");
  const [teamId, setTeamId] = useState<string>("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [unlockedRooms, setUnlockedRooms] = useState<Set<number>>(new Set());
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [modalStatus, setModalStatus] = useState<ModalStatus>("idle");

  useEffect(() => {
    // Check if team is already registered in localStorage
    const savedTeamId = localStorage.getItem("currentTeamId");
    const savedTeamName = localStorage.getItem("currentTeamName");

    if (savedTeamId && savedTeamName) {
      setTeamId(savedTeamId);
      setTeamName(savedTeamName);

      // Load unlocked rooms from localStorage
      const teamData = localStorage.getItem(savedTeamId);
      if (teamData) {
        try {
          const parsedData = JSON.parse(teamData);
          setUnlockedRooms(new Set(parsedData.unlockedRooms || []));
        } catch (err) {
          console.error("Error parsing team data:", err);
        }
      }
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const handleTeamComplete = (name: string, id: string) => {
    setTeamName(name);
    setTeamId(id);
    setShowOnboarding(false);
  };

  const updateTeamProgress = async (newUnlockedRooms: Set<number>) => {
    if (!teamId) return;

    try {
      const teamData = {
        teamId,
        teamName,
        unlockedRooms: Array.from(newUnlockedRooms),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      // Update both localStorage and Vercel API
      localStorage.setItem(teamId, JSON.stringify(teamData));
      await api.saveTeam(teamData);
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const handleRoomClick = (roomId: number) => {
    if (unlockedRooms.has(roomId)) {
      const room = rooms.find((r) => r.id === roomId);
      if (room) {
        window.open(room.link, "_blank");
      }
    } else {
      setSelectedRoom(roomId);
      setModalStatus("idle");
    }
  };

  const handlePasswordSubmit = (password: string) => {
    const room = rooms.find((r) => r.id === selectedRoom);
    if (!room) return;

    if (password.toLowerCase() === room.password.toLowerCase()) {
      setModalStatus("granted");
      const newUnlocked = new Set([...unlockedRooms, room.id]);
      setUnlockedRooms(newUnlocked);
      updateTeamProgress(newUnlocked);

      setTimeout(() => {
        window.open(room.link, "_blank");
        setSelectedRoom(null);
        setModalStatus("idle");
      }, 1500);
    } else {
      setModalStatus("denied");
      setTimeout(() => {
        setModalStatus("idle");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <MatrixRain />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12 space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-destructive animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-destructive tracking-wider font-mono">
              ACCESS DENIED
            </h1>
            <Shield className="w-10 h-10 text-destructive animate-pulse" />
          </div>

          {teamName && (
            <div className="terminal-border p-4 max-w-md mx-auto glow-green">
              <div className="text-accent font-mono">
                TEAM: <span className="font-bold">{teamName}</span>
              </div>
            </div>
          )}

          <div className="terminal-border p-6 max-w-2xl mx-auto glow-red">
            <div className="flex items-start gap-3 mb-3">
              <Terminal className="w-5 h-5 text-accent mt-1" />
              <div className="text-left">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 font-mono">
                  RELAY CODING + CLUE HUNT
                </h2>
                <p className="text-muted-foreground font-mono text-sm">
                  &gt; 14 locked challenges await your team
                </p>
                <p className="text-muted-foreground font-mono text-sm">
                  &gt; Enter the correct key to unlock your next coding mission
                </p>
              </div>
            </div>
          </div>

          <ProgressTracker
            unlockedCount={unlockedRooms.size}
            totalRooms={rooms.length}
          />
        </header>

        <main>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                roomNumber={room.id}
                isUnlocked={unlockedRooms.has(room.id)}
                onClick={() => handleRoomClick(room.id)}
              />
            ))}
          </div>
        </main>
      </div>

      <TeamOnboarding isOpen={showOnboarding} onComplete={handleTeamComplete} />

      <PasswordModal
        isOpen={selectedRoom !== null}
        onClose={() => setSelectedRoom(null)}
        onSubmit={handlePasswordSubmit}
        roomNumber={selectedRoom || 0}
        status={modalStatus}
      />
    </div>
  );
};

export default Index;
