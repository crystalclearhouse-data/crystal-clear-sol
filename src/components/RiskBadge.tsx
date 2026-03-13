import type { RiskLevel } from "@/lib/constants";
import { cn } from "@/lib/utils";

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  low: { label: "Low Risk", className: "bg-risk-low/20 text-risk-low border-risk-low/40" },
  medium: { label: "Medium Risk", className: "bg-risk-medium/20 text-risk-medium border-risk-medium/40" },
  high: { label: "High Risk", className: "bg-risk-high/20 text-risk-high border-risk-high/40" },
  critical: { label: "Critical Risk", className: "bg-risk-critical/20 text-risk-critical border-risk-critical/40" },
};

export function RiskBadge({ level, large }: { level: RiskLevel; large?: boolean }) {
  const config = riskConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        config.className,
        large ? "px-6 py-3 text-xl" : "px-3 py-1 text-sm"
      )}
    >
      {config.label}
    </span>
  );
}
