"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function addMonitor(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!name || !/^https?:\/\//.test(url) || !URL.canParse(url)) return;
  await db.monitor.create({ data: { name, url } });
  revalidatePath("/");
}

export async function removeMonitor(formData: FormData) {
  await db.monitor.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/");
}
