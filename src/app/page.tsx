import { db } from "@/lib/db";
import { addMonitor, removeMonitor } from "./actions";
import Refresher from "./refresher";

export const dynamic = "force-dynamic";

async function getMonitors() {
  const since = new Date(Date.now() - 24 * 3600 * 1000);
  return db.monitor.findMany({
    orderBy: { id: "asc" },
    include: {
      checks: { where: { at: { gte: since } }, orderBy: { at: "desc" } },
    },
  });
}

export default async function Home() {
  const monitors = await getMonitors();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Refresher />
      <h1 className="mb-6 text-2xl font-bold">Network Uptime Monitor</h1>

      <form action={addMonitor} className="mb-8 flex gap-2">
        <input
          name="name"
          placeholder="Name"
          required
          className="w-40 rounded border px-3 py-2"
        />
        <input
          name="url"
          type="url"
          placeholder="https://example.com"
          required
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Add
        </button>
      </form>

      <ul className="space-y-4">
        {monitors.map((m) => {
          const last = m.checks[0];
          const pct = m.checks.length
            ? `${((m.checks.filter((c) => c.up).length / m.checks.length) * 100).toFixed(2)}%`
            : "-";
          const dot = !last
            ? "bg-gray-400"
            : last.up
              ? "bg-green-500"
              : "bg-red-500";

          return (
            <li key={m.id} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className={`mr-2 inline-block h-3 w-3 rounded-full ${dot}`}
                  />
                  <span className="font-semibold">{m.name}</span>
                  <span className="ml-2 text-sm text-gray-500">{m.url}</span>
                </div>
                <form action={removeMonitor}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="text-sm text-red-600">Delete</button>
                </form>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {last
                  ? `${last.up ? "UP" : "DOWN"} | ${last.status ?? "timeout"} | ${last.ms} ms`
                  : "waiting for first check"}
                {" | "}24h uptime: {pct}
              </p>

              <div className="mt-3 flex gap-px">
                {m.checks
                  .slice(0, 60)
                  .reverse()
                  .map((c) => (
                    <span
                      key={c.id}
                      className={`h-6 w-1.5 rounded-sm ${c.up ? "bg-green-500" : "bg-red-500"}`}
                    />
                  ))}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
