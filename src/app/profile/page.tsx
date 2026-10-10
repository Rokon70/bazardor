"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Avatar } from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";

// Crop the chosen photo to a square, shrink it to 256x256 and return a small JPEG data URL
function resizeImage(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => reject(new Error("Invalid image"));
    img.src = url;
  });
}

export default function UpdateProfile() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name);
      setImage(session.user.image ?? null);
    }
  }, [session?.user]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be smaller than 5 MB");
    try {
      setImage(await resizeImage(file));
    } catch {
      toast.error("Could not read this image");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    setLoading(true);
    const { error } = await authClient.updateUser({ name: name.trim(), image });
    setLoading(false);
    if (error) return toast.error(error.message || "Could not update profile");
    toast.success("Profile updated successfully");
    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="container-x max-w-xl py-10">
      <h1 className="text-3xl font-bold">Update profile</h1>
      <form onSubmit={onSubmit} className="card mt-6 space-y-5 p-6">
        <div className="flex items-center gap-4">
          <Avatar name={name || "U"} image={image} size={80} />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-outline" onClick={() => fileRef.current?.click()}>
              Change photo
            </button>
            {image && (
              <button type="button" className="btn-outline !text-up" onClick={() => setImage(null)}>
                Remove
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Updating…" : "Update profile"}
        </button>
      </form>
      <Link href="/profile" className="mt-6 inline-block text-sm text-neutral-500 hover:text-brand">
        ← Back to profile
      </Link>
    </div>
  );
}