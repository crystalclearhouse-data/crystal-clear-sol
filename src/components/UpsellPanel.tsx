import { Button } from "@/components/ui/button";
import { CLEARSIGNAL_APP_URL } from "@/lib/constants";
import { Shield, Activity, Bell } from "lucide-react";

interface UpsellPanelProps {
  address: string;
  email?: string;
}

export function UpsellPanel({ address, email }: UpsellPanelProps) {
  const ctaUrl = `${CLEARSIGNAL_APP_URL}/start?address=${encodeURIComponent(address)}${email ? `&email=${encodeURIComponent(email)}` : ""}`;

  return (
    <div className="rounded-xl border border-neon-teal/20 bg-card p-6 md:p-8">
      <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">
        This is a snapshot. <span className="text-gradient-teal-pink">ClearSignal</span> watches your wallet 24/7.
      </h3>
      <ul className="space-y-3 mb-6">
        <li className="flex items-center gap-3 text-muted-foreground">
          <Activity className="w-5 h-5 text-neon-teal shrink-0" />
          Live scores instead of one‑off checks.
        </li>
        <li className="flex items-center gap-3 text-muted-foreground">
          <Shield className="w-5 h-5 text-neon-teal shrink-0" />
          Portfolio‑level risk meter.
        </li>
        <li className="flex items-center gap-3 text-muted-foreground">
          <Bell className="w-5 h-5 text-neon-teal shrink-0" />
          Elite Discord alerts when your risk spikes.
        </li>
      </ul>
      <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="hero" size="lg" className="w-full text-base">
          Unlock full ClearSignal →
        </Button>
      </a>
    </div>
  );
}
