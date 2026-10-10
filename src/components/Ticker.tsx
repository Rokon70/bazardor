"use client";
import { useProducts } from "@/lib/use-data";
import { fmtNum, getChange, toBn, unitBn } from "@/lib/bn";

export default function Ticker() {
  const { data } = useProducts();
  if (!data) return <div className="h-10 border-b border-line bg-card" />;
  const items = [...data, ...data]; // duplicated for seamless loop
  return (
    <div className="ticker overflow-hidden border-b border-line bg-card" aria-label="দামের তালিকা">
      <div className="flex w-max animate-marquee">
        {items.map((p, i) => {
          const c = getChange(p);
          return (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap border-r border-line px-4 py-2 text-sm">
              <span>{p.image}</span>
              <span className="font-medium">{p.nameBn}</span>
              <span className="text-neutral-600">{fmtNum(p.today)} টাকা/{unitBn(p.unit)}</span>
              <span className={`font-semibold ${c.dir === "up" ? "text-up" : c.dir === "down" ? "text-down" : "text-neutral-500"}`}>
                {c.dir === "up" ? "▲" : c.dir === "down" ? "▼" : "—"} {toBn(c.pct.toFixed(1))}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
