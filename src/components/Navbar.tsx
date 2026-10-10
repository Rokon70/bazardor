"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { bnDate } from "@/lib/bn";
import { useCategories } from "@/lib/use-data";

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { data: cats } = useCategories();
  const { data: session, isPending } = authClient.useSession();
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => setDate(bnDate()), []);
  useEffect(() => setOpen(false), [path]);

  const signOut = () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছে");
          setOpen(false);
          router.push("/");
          router.refresh();
        },
      },
    });

  const user = session?.user;

  return (
    <header className="border-b border-line bg-card">
      <div className="container-x flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-lg">🛒</span>
          <span>
            <span className="block text-lg font-bold leading-tight">বাজার দর</span>
            <span className="block text-[11px] text-neutral-600" suppressHydrationWarning>{date || "\u00A0"}</span>
          </span>
        </Link>

        <div className="relative">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-neutral-200" />
          ) : user ? (
            <>
              <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-neutral-100">
                <Avatar name={user.name} image={user.image} />
                <span className="hidden text-sm font-medium sm:inline">{user.name.split(" ")[0]}</span>
                <span className="text-[10px] text-neutral-500">▾</span>
              </button>
              {open && (
                <>
                  <button aria-label="close" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-line bg-white p-4 shadow-lg">
                    <p className="font-semibold">{user.name}</p>
                    <p className="mb-3 truncate text-xs text-neutral-500">{user.email}</p>
                    <Link href="/profile" className="block rounded py-1.5 text-sm hover:text-brand">👤 আমার প্রোফাইল</Link>
                    <button onClick={signOut} className="block w-full rounded py-1.5 text-left text-sm text-up">↩ সাইন আউট</button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-100">সাইন ইন</Link>
              <Link href="/signup" className="btn-primary">সাইন আপ</Link>
            </div>
          )}
        </div>
      </div>

      <nav className="border-t border-line">
        <div className="container-x no-scrollbar flex gap-1 overflow-x-auto py-2">
          {cats
            ? cats.map((c) => {
                const active = path === `/category/${c.slug}`;
                return (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm transition ${
                      active ? "bg-brand font-medium text-white" : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <span className="text-xs">{c.icon}</span>{c.nameBn}
                  </Link>
                );
              })
            : Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-8 w-20 shrink-0 animate-pulse rounded-lg bg-neutral-200" />)}
        </div>
      </nav>
    </header>
  );
}

export function Avatar({ name, image, size = 36 }: { name: string; image?: string | null; size?: number }) {
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt={name} width={size} height={size} style={{ width: size, height: size }} className="rounded-lg object-cover" />
  ) : (
    <span style={{ width: size, height: size }} className="flex items-center justify-center rounded-lg bg-brand-soft font-semibold text-brand">
      {name?.[0]?.toUpperCase()}
    </span>
  );
}
