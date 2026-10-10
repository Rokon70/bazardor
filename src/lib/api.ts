const BASES = [
  process.env.NEXT_PUBLIC_API_BASE_1 || "https://api.api-store.workers.dev/api/bazardor",
  process.env.NEXT_PUBLIC_API_BASE_2 || "https://api.abcz.workers.dev/api/bazardor",
];

export async function getJSON<T>(path: string, init?: RequestInit): Promise<T> {
  let lastErr: unknown;
  for (const base of BASES) {
    try {
      const res = await fetch(base + path, init);
      if (res.ok) return (await res.json()) as T;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}
