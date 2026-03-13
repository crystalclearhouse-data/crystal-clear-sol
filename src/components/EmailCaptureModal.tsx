import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

interface EmailCaptureModalProps {
  open: boolean;
  onSubmit: (email: string) => void;
  onClose: () => void;
  loading?: boolean;
}

export function EmailCaptureModal({ open, onSubmit, onClose, loading }: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setError("");
    onSubmit(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Almost there 🚀
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Where should we send your full breakdown? You'll also get early access to ClearSignal Pro.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="hero" size="lg" disabled={loading}>
            {loading ? "Loading…" : "Show my wallet check"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
