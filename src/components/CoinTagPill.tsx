import type { CoinTag } from "@/lib/constants";
import { cn } from "@/lib/utils";

const tagConfig: Record<CoinTag, string> = {
  ACCUMULATE: "bg-tag-accumulate/20 text-tag-accumulate border-tag-accumulate/40",
  HOLD: "bg-tag-hold/20 text-tag-hold border-tag-hold/40",
  CAUTION: "bg-tag-caution/20 text-tag-caution border-tag-caution/40",
  AVOID: "bg-tag-avoid/20 text-tag-avoid border-tag-avoid/40",
  EXIT: "bg-tag-exit/20 text-tag-exit border-tag-exit/40",
};

export function CoinTagPill({ tag }: { tag: CoinTag }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", tagConfig[tag])}>
      {tag}
    </span>
  );
}
