import type { Change, Product } from "./types";

const DIGITS = "০১২৩৪৫৬৭৮৯";
export const toBn = (v: number | string) => String(v).replace(/\d/g, (d) => DIGITS[+d]);

export const fmtNum = (n: number) =>
  Number.isInteger(n) ? toBn(n.toLocaleString("en-US")) : toBn(n.toFixed(2));

export const bnDate = () =>
  new Date().toLocaleDateString("bn-BD", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka",
  });

const UNITS: Record<string, string> = {
  kg: "কেজি", liter: "লিটার", litre: "লিটার", l: "লিটার", dozen: "ডজন", piece: "পিস", pcs: "পিস", pc: "পিস",
};
export const unitBn = (u: string) => UNITS[u?.toLowerCase()] ?? u;

export function getChange(p: Product): Change {
  
  if (p.change) return { ...p.change, pct: Math.abs(p.change.pct) };
  const diff = p.today - p.yesterday;
  if (!diff || !p.yesterday) return { dir: "flat", pct: 0 };
  return { dir: diff > 0 ? "up" : "down", pct: Math.round((Math.abs(diff) / p.yesterday) * 1000) / 10 };
}