import { useState } from "react";
import { MatrixRain } from "@/components/MatrixRain";
import { RoomCard } from "@/components/RoomCard";
import { PasswordModal } from "@/components/PasswordModal";
import { ProgressTracker } from "@/components/ProgressTracker";
import { rooms } from "@/data/rooms";
import { Shield, Terminal } from "lucide-react";

type ModalStatus = "idle" | "denied" | "granted";

const Index = () => {
  const [unlockedRooms, setUnlockedRooms] = useState<Set<number>>(new Set());
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [modalStatus, setModalStatus] = useState<ModalStatus>("idle");

  const handleRoomClick = (roomId: number) => {
    if (unlockedRooms.has(roomId)) {
      // Already unlocked, go directly to the link
      const room = rooms.find((r) => r.id === roomId);
      if (room) {
        window.open(room.link, "_blank");
      }
    } else {
      // Show password modal
      setSelectedRoom(roomId);
      setModalStatus("idle");
    }
  };

  const handlePasswordSubmit = (password: string) => {
    const room = rooms.find((r) => r.id === selectedRoom);
    
    if (!room) return;

    if (password.toLowerCase() === room.password.toLowerCase()) {
      // Correct password
      setModalStatus("granted");
      setUnlockedRooms((prev) => new Set([...prev, room.id]));
      
      // Redirect after a short delay
      setTimeout(() => {
        window.open(room.link, "_blank");
        setSelectedRoom(null);
        setModalStatus("idle");
      }, 1500);
    } else {
      // Wrong password
      setModalStatus("denied");
      setTimeout(() => {
        setModalStatus("idle");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MatrixRain />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <header className="text-center mb-12 space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-destructive animate-pulse-glow" />
            <h1 className="text-4xl md:text-6xl font-bold text-destructive tracking-wider font-mono">
              ACCESS DENIED
            </h1>
            <Shield className="w-10 h-10 text-destructive animate-pulse-glow" />
          </div>
          
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
                <p className="text-accent font-mono text-sm mt-2">
                  &gt; Unauthorized access will be logged and traced
                </p>
              </div>
            </div>
          </div>

          <ProgressTracker 
            unlockedCount={unlockedRooms.size} 
            totalRooms={rooms.length} 
          />
        </header>

        {/* Rooms Grid */}
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

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="inline-block terminal-border px-6 py-3 glow-cyan">
            <p className="text-xs text-muted-foreground font-mono">
              SECURITY LEVEL: <span className="text-destructive font-bold">MAXIMUM</span>
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              © 2025 CYBER RELAY EVENT | ALL RIGHTS RESERVED
            </p>
          </div>
        </footer>
      </div>

      {/* Password Modal */}
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
