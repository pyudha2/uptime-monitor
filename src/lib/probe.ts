import { lookup } from "node:dns/promises";

export type Probe = {
  up: boolean;
  status: number | null;
  ms: number;
  ip: string | null;
};

async function resolveIp(url: string) {
  try {
    return (await lookup(new URL(url).hostname)).address;
  } catch {
    return null;
  }
}

export async function probe(url: string, timeoutMs = 5000): Promise<Probe> {
  const ip = await resolveIp(url);
  const t = performance.now();
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "follow",
      cache: "no-store",
    });
    await res.body?.cancel();
    return {
      up: res.ok,
      status: res.status,
      ms: Math.round(performance.now() - t),
      ip,
    };
  } catch {
    return {
      up: false,
      status: null,
      ms: Math.round(performance.now() - t),
      ip,
    };
  }
}
