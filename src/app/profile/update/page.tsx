"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfile() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (session?.user) setName(session.user.name); }, [session?.user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("নাম খালি রাখা যাবে না");
    setLoading(true);
    const { error } = await authClient.updateUser({ name: name.trim() });
    setLoading(false);
    if (error) return toast.error(error.message || "তথ্য আপডেট করা যায়নি");
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="container-x max-w-xl py-10">
      <h1 className="text-3xl font-bold">তথ্য আপডেট করুন</h1>
      <form onSubmit={onSubmit} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">নাম</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার নাম" />
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}</button>
      </form>
      <Link href="/profile" className="mt-6 inline-block text-sm text-neutral-500 hover:text-brand">← প্রোফাইলে ফিরে যান</Link>
    </div>
  );
}
