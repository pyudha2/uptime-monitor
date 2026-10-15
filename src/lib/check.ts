import { db } from "./db";
import { probe } from "./probe";

const KEEP_DAYS = 7;

export async function runChecks() {
  const monitors = await db.monitor.findMany();
  await Promise.all(
    monitors.map(async (m) => {
      const r = await probe(m.url);
      await db.check.create({ data: { monitorId: m.id, ...r } });
    }),
  );
  await db.check.deleteMany({
    where: { at: { lt: new Date(Date.now() - KEEP_DAYS * 86_400_000) } },
  });
}
