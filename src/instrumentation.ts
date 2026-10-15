export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const g = globalThis as unknown as { __uptime?: boolean };
  if (g.__uptime) return;
  g.__uptime = true;

  const { runChecks } = await import("./lib/check");
  const tick = () => runChecks().catch(console.error);

  tick();
  setInterval(tick, 60_000);
}
