"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState("/");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("reason") === "login") toast.error("এই পাতা দেখতে আগে সাইন ইন করুন", { id: "login-required" });
    const r = q.get("redirect");
    if (r && r.startsWith("/")) setRedirect(r);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return toast.error("ইমেইল ও পাসওয়ার্ড দিন");
    if (password.length < 8) return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়");
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push(redirect);
    router.refresh();
  }

  const social = async (provider: "google" | "github") => {
    const { error } = await authClient.signIn.social({ provider, callbackURL: redirect });
    if (error) toast.error(error.message || "সোশ্যাল সাইন ইন ব্যর্থ হয়েছে");
  };

  return (
    <div className="container-x max-w-md py-12 text-center">
      <h1 className="text-3xl font-bold">সাইন ইন</h1>
      <p className="mt-2 text-sm text-neutral-500">বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।</p>
      <form onSubmit={onSubmit} className="card mt-6 space-y-4 p-6 text-left">
        <div>
          <label className="mb-1 block text-sm font-medium">ইমেইল</label>
          <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">পাসওয়ার্ড</label>
          <input className="input" type="password" placeholder="কমপক্ষে ৮ অক্ষর" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? "অপেক্ষা করুন…" : "সাইন ইন"}</button>
        <div className="flex items-center gap-3 text-xs text-neutral-500"><hr className="flex-1 border-line" />অথবা<hr className="flex-1 border-line" /></div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => social("google")} className="btn-outline">Google দিয়ে চালিয়ে যান</button>
          <button type="button" onClick={() => social("github")} className="btn-outline">GitHub দিয়ে চালিয়ে যান</button>
        </div>
        <p className="text-center text-sm">অ্যাকাউন্ট নেই? <Link href="/signup" className="text-brand">সাইন আপ করুন</Link></p>
      </form>
      <Link href="/" className="mt-6 inline-block text-sm text-neutral-500 hover:text-brand">← হোম পেজে ফিরে যান</Link>
    </div>
  );
}
