import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-20 text-center">
      <div className="text-6xl">🛒</div>
      <h1 className="mt-4 text-5xl font-bold text-brand">৪০৪</h1>
      <p className="mt-2 text-lg font-semibold">পাতাটি খুঁজে পাওয়া যায়নি</p>
      <p className="mt-1 text-neutral-500">আপনি যে ঠিকানায় এসেছেন সেটি ভুল বা মুছে ফেলা হয়েছে।</p>
      <Link href="/" className="btn-primary mt-6">হোম পেজে ফিরে যান</Link>
    </div>
  );
}
