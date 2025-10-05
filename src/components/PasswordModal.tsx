import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Terminal, AlertTriangle, CheckCircle } from "lucide-react";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  roomNumber: number;
  status: "idle" | "denied" | "granted";
}

export const PasswordModal = ({
  isOpen,
  onClose,
  onSubmit,
  roomNumber,
  status,
}: PasswordModalProps) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onSubmit(password.trim());
    }
  };

  const handleClose = () => {
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="terminal-border border-2 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-accent font-mono tracking-wider">
            <Terminal className="w-5 h-5" />
            SECURITY CHECKPOINT
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground font-mono">
            <div className="mb-2">
              &gt; TARGET: <span className="text-foreground">ROOM {roomNumber.toString().padStart(2, "0")}</span>
            </div>
            <div className="mb-4">
              &gt; STATUS: <span className="text-accent">AUTHENTICATION REQUIRED</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-mono mb-2 block">
                ENTER ACCESS KEY:
              </label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border font-mono text-foreground focus:border-accent focus:glow-cyan"
                placeholder="••••••••"
                autoFocus
              />
            </div>

            {status === "denied" && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive rounded animate-glitch">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="text-destructive font-mono text-sm font-bold">
                  ACCESS DENIED
                </span>
              </div>
            )}

            {status === "granted" && (
              <div className="flex items-center gap-2 p-3 bg-success/10 border border-success rounded">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-success font-mono text-sm font-bold">
                  ACCESS GRANTED — REDIRECTING...
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-bold glow-green"
                disabled={status === "granted"}
              >
                AUTHENTICATE
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="font-mono"
              >
                ABORT
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
