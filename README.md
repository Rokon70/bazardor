# 🛒 বাজার দর (BazarDor)

বাংলাদেশের প্রয়োজনীয় পণ্য — চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলার আজকের বাজারদর এক নজরে দেখার ওয়েব অ্যাপ।
*A Bangla market-price tracker built with Next.js, Tailwind CSS and BetterAuth.*

## ✨ Key Features
1. **Live price ticker** — infinite marquee with emoji, price and ▲/▼ change %.
2. **Risers & fallers** — top 6 price increases and decreases of the day, plus all products in a responsive grid.
3. **Category pages** with skeleton loading, 404-style empty state and a **sort dropdown** that sorts by numeric value (Bengali numerals safe).
4. **Protected product details** — min / max / average price and a market-wise price table.
5. **Authentication with BetterAuth** — email/password, Google & GitHub, toast feedback, profile page and **update name** feature.
6. Fully responsive (mobile, tablet, desktop), custom 404 page, Bengali digits everywhere.

## 🧰 Technologies
Next.js 14 (App Router) · TypeScript · Tailwind CSS · BetterAuth · PostgreSQL (`pg`) · react-hot-toast · Hind Siliguri font

## 🚀 Run locally
```bash
npm install
cp .env.example .env.local      # fill in the values
npm run auth:migrate            # creates BetterAuth tables in your Postgres DB
npm run dev
```

## ☁️ Deploy on Vercel
1. Push to GitHub and import the repo in Vercel.
2. Add the env variables from `.env.example` (set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel URL).
3. OAuth callback URLs: `https://YOUR-APP.vercel.app/api/auth/callback/google` and `/github`.
4. Deploy. Dynamic routes (`/product/[slug]`, `/category/[slug]`) work on refresh.

API: `https://api.api-store.workers.dev/api/bazardor` (fallback: `https://api.abcz.workers.dev/api/bazardor`)
