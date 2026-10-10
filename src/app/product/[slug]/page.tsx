import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import { getJSON } from "@/lib/api";
import { fmtNum, getChange, unitBn } from "@/lib/bn";
import type { Product } from "@/lib/types";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product: Product | undefined;
  try {
    const list = await getJSON<Product[]>("/products", { next: { revalidate: 60 } });
    const found = list.find((p) => p.slug === params.slug);
    if (found) product = found.markets ? found : await getJSON<Product>(`/products/${found.id}`, { next: { revalidate: 60 } });
  } catch {
    notFound();
  }
  if (!product) notFound();

  const change = getChange(product);
  const diff = Math.abs(product.today - product.yesterday);
  const word = change.dir === "up" ? "বেড়েছে" : change.dir === "down" ? "কমেছে" : "অপরিবর্তিত আছে";
  const markets = [...(product.markets ?? [])]
    .map((m) => ({ ...m, avg: (m.min + m.max) / 2 }))
    .sort((a, b) => a.avg - b.avg);
  const min = markets.length ? Math.min(...markets.map((m) => m.min)) : product.today;
  const max = markets.length ? Math.max(...markets.map((m) => m.max)) : product.today;
  const unit = unitBn(product.unit);

  const stats = [
    { label: "সর্বনিম্ন দাম", value: min, color: "text-down", note: "সবচেয়ে কম দামের বাজার" },
    { label: "সর্বাধিক দাম", value: max, color: "text-up", note: "সবচেয়ে বেশি দামের বাজার" },
    { label: "গড় দাম", value: product.today, color: "text-down", note: `প্রতি ${unit}-এর হিসাবে` },
  ];

  return (
    <div className="container-x space-y-6 py-6">
      <nav className="flex items-center gap-2 text-sm text-neutral-600">
        <Link href="/" className="hover:text-brand">হোম</Link>›
        <Link href={`/category/${product.category}`} className="hover:text-brand">{product.categoryNameBn}</Link>›
        <span>{product.nameBn}</span>
      </nav>

      <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-4xl">{product.image}</div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{product.nameBn}</h1>
            <p className="text-sm text-neutral-500">প্রতি {unit} · {product.categoryNameBn}</p>
            <p className="mt-2 text-sm">গতকালের তুলনায় আজ দাম <b>{word}</b>{diff ? ` · ${fmtNum(diff)} টাকা` : ""}</p>
          </div>
        </div>
        <div className="rounded-xl bg-neutral-100 px-6 py-4 text-center">
          <p className="text-xs text-neutral-500">আজকের দাম</p>
          <p className="text-3xl font-bold">{fmtNum(product.today)}</p>
          <p className="text-xs text-neutral-500">টাকা / {unit}</p>
          <div className="mt-1"><Badge change={change} /></div>
        </div>
      </section>

      <section className="card p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-bold">দামের সারসংক্ষেপ</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-line p-4">
              <p className="text-xs text-neutral-600">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{fmtNum(s.value)} <span className="text-sm font-medium">টাকা</span></p>
              <p className="text-xs text-neutral-500">{s.note}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-3 mt-8 text-lg font-bold">বাজারভিত্তিক আজকের দাম</h2>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-neutral-500">
                <th className="p-3 font-medium">বাজার</th><th className="p-3 font-medium">বিভাগ</th>
                <th className="p-3 text-right font-medium">সর্বনিম্ন</th><th className="p-3 text-right font-medium">সর্বাধিক</th>
                <th className="p-3 text-right font-medium">গড়</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m, i) => (
                <tr key={m.market} className={`border-b border-neutral-300 last:border-0 ${i % 2 ? "bg-neutral-100/60" : ""}`}>
                  <td className="p-3">{m.market}</td><td className="p-3">{m.division}</td>
                  <td className="p-3 text-right">{fmtNum(m.min)} টাকা</td><td className="p-3 text-right">{fmtNum(m.max)} টাকা</td>
                  <td className="p-3 text-right font-bold">{fmtNum(m.avg)} টাকা</td>
                </tr>
              ))}
              {!markets.length && <tr><td colSpan={5} className="p-6 text-center text-neutral-500">বাজারভিত্তিক তথ্য পাওয়া যায়নি।</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
