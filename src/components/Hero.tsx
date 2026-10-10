"use client";
import { useEffect, useState } from "react";
import { bnDate } from "@/lib/bn";

export default function Hero() {
  const [date, setDate] = useState("");
  useEffect(() => setDate(bnDate()), []);
  return (
    <section className="card grid items-center gap-6 overflow-hidden p-6 md:grid-cols-[1.4fr_1fr] md:p-8">
      <div>
        <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand" suppressHydrationWarning>
          {date || "আজকের বাজার"}
        </span>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">আজকের বাজারের দাম এক নজরে</h1>
        <p className="mt-4 max-w-xl text-neutral-600">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
        </p>
        <a href="#সব-পণ্য" className="btn-primary mt-6 !px-5">সব পণ্য দেখুন</a>
      </div>
      <svg viewBox="0 0 300 220" className="mx-auto w-full max-w-xs" role="img" aria-label="সবজির ঝুড়ি">
        <ellipse cx="150" cy="198" rx="115" ry="14" fill="#e8ece6" />
        <circle cx="115" cy="85" r="38" fill="#ef4444" /><circle cx="180" cy="72" r="42" fill="#22c55e" />
        <circle cx="75" cy="112" r="22" fill="#a855f7" /><circle cx="135" cy="115" r="20" fill="#f97316" />
        <circle cx="220" cy="112" r="22" fill="#f59e0b" />
        <path d="M110 48c0-14 8-22 18-26M180 30c0-12 6-20 14-24" stroke="#15803d" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M65 128h170l-18 62a8 8 0 0 1-8 6H91a8 8 0 0 1-8-6z" fill="#b45309" />
        <rect x="60" y="120" width="180" height="14" rx="3" fill="#92400e" />
        <path d="M110 134l6 60M150 134v62M190 134l-6 60" stroke="#92400e" strokeWidth="4" />
      </svg>
    </section>
  );
}
