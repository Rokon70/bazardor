"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignUp() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) return toast.error("আপনার নাম লিখুন");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return toast.error("সঠিক ইমেইল দিন");
    if (f.password.length < 8) return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    if (f.password !== f.confirm) return toast.error("দুটি পাসওয়ার্ড মেলেনি");
    setLoading(true);
    const { error } = await authClient.signUp.email({ name: f.name.trim(), email: f.email, password: f.password });
    setLoading(false);
    if (error) return toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন");
    router.push("/signin");
  }

  const social = async (provider: "google" | "github") => {
    const { error } = await authClient.signIn.social({ provider, callbackURL: "/" });
    if (error) toast.error(error.message || "সোশ্যাল সাইন ইন ব্যর্থ হয়েছে");
  };

  return (
    <div className="container-x max-w-md py-12 text-center">
      <h1 className="text-3xl font-bold">অ্যাকাউন্ট তৈরি করুন</h1>
      <p className="mt-2 text-sm text-neutral-500">বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
      <form onSubmit={onSubmit} className="card mt-6 space-y-4 p-6 text-left">
        {([
          ["name", "নাম", "text", "যেমন: রহিম উদ্দিন"],
          ["email", "ইমেইল", "email", "you@example.com"],
          ["password", "পাসওয়ার্ড", "password", "কমপক্ষে ৮ অক্ষর"],
          ["confirm", "পাসওয়ার্ড নিশ্চিত করুন", "password", "আবার লিখুন"],
        ] as const).map(([k, label, type, ph]) => (
          <div key={k}>
            <label className="mb-1 block text-sm font-medium">{label}</label>
            <input className="input" type={type} placeholder={ph} value={f[k]} onChange={set(k)} />
          </div>
        ))}
        <button className="btn-primary w-full" disabled={loading}>{loading ? "অপেক্ষা করুন…" : "অ্যাকাউন্ট তৈরি করুন"}</button>
        <div className="flex items-center gap-3 text-xs text-neutral-500"><hr className="flex-1 border-line" />অথবা<hr className="flex-1 border-line" /></div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => social("google")} className="btn-outline">Google দিয়ে চালিয়ে যান</button>
          <button type="button" onClick={() => social("github")} className="btn-outline">GitHub দিয়ে চালিয়ে যান</button>
        </div>
        <p className="text-center text-sm">অ্যাকাউন্ট আছে? <Link href="/signin" className="text-brand">সাইন ইন করুন</Link></p>
      </form>
      <Link href="/" className="mt-6 inline-block text-sm text-neutral-500 hover:text-brand">← হোম পেজে ফিরে যান</Link>
    </div>
  );
}
