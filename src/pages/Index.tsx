import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";
import { Footer } from "@/components/Footer";
import { isValidSolanaAddress } from "@/lib/constants";
import { Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [submittedAddress, setSubmittedAddress] = useState("");

  const utm_source = searchParams.get("utm_source") || undefined;
  const utm_campaign = searchParams.get("utm_campaign") || undefined;

  const handleCheck = () => {
    const trimmed = address.trim();
    if (!isValidSolanaAddress(trimmed)) {
      setError("Please enter a valid Solana wallet address.");
      return;
    }
    setError("");
    setSubmittedAddress(trimmed);
    setShowEmailModal(true);
  };

  const handleEmailSubmit = (email: string) => {
    // Store lead — in production this would go to Supabase
    console.log("Lead captured:", { email, wallet_address: submittedAddress, utm_source, utm_campaign });
    navigate(`/results?address=${encodeURIComponent(submittedAddress)}&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Logo / Brand */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-8 h-8 text-neon-teal" />
            <span className="text-xl font-bold text-gradient-teal-pink">ClearSignal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Is your Solana bag{" "}
            <span className="text-gradient-teal-pink">secretly trash?</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            Paste a wallet or connect Phantom and we'll rate every coin you hold:{" "}
            <span className="text-tag-accumulate font-medium">Accumulate</span>,{" "}
            <span className="text-tag-hold font-medium">Hold</span>,{" "}
            <span className="text-tag-avoid font-medium">Avoid</span>, or{" "}
            <span className="text-tag-exit font-medium">Exit</span> – in under 10 seconds.
          </p>

          {/* Wallet input */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Paste Solana wallet address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
              />
              <Button variant="hero" onClick={handleCheck} className="shrink-0">
                Check my wallet
              </Button>
            </div>

            {error && <p className="text-sm text-destructive text-left">{error}</p>}

            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <div className="flex-1 h-px bg-border" />
              <span>or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button
              variant="hero-outline"
              className="w-full"
              onClick={() => {
                // Placeholder for Solana wallet adapter
                alert("Phantom wallet connection coming soon! For now, paste your address above.");
              }}
            >
              Connect wallet (read‑only)
            </Button>

            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Read‑only: we only see your public address, never your seed phrase or private key.
            </p>
          </div>
        </div>
      </main>

      <EmailCaptureModal
        open={showEmailModal}
        onSubmit={handleEmailSubmit}
        onClose={() => setShowEmailModal(false)}
      />

      <Footer />
    </div>
  );
};

export default Index;
