import { toBn } from "@/lib/bn";
import type { Change } from "@/lib/types";

export default function Badge({ change, big = false }: { change: Change; big?: boolean }) {
  const pct = toBn(change.pct.toFixed(1)) + "%";
  const size = big ? "text-sm px-3 py-1" : "text-xs px-2 py-0.5";
  if (change.dir === "up")
    return <span className={`rounded-full bg-red-50 font-semibold text-up ${size}`}>▲ {pct}</span>;
  if (change.dir === "down")
    return <span className={`rounded-full bg-green-50 font-semibold text-down ${size}`}>▼ {pct}</span>;
  return <span className={`rounded-full bg-neutral-100 font-semibold text-neutral-500 ${size}`}>— {toBn("0.0")}%</span>;
}
