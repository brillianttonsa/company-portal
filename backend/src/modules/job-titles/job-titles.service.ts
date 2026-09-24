import { asc, eq } from "drizzle-orm";
import { db } from "../../database/client.js";
import { jobTitles } from "../../database/schema/index.js";
import { AppError } from "../../shared/errors.js";

export function list() { return db.select().from(jobTitles).orderBy(asc(jobTitles.name)); }
export async function get(id: string) {
  const [jobTitle] = await db.select().from(jobTitles).where(eq(jobTitles.id, id)).limit(1);
  if (!jobTitle) throw new AppError(404, "Job title not found");
  return jobTitle;
}
export async function create(input: typeof jobTitles.$inferInsert) { const [jobTitle] = await db.insert(jobTitles).values(input).returning(); return jobTitle; }
export async function update(id: string, input: Partial<typeof jobTitles.$inferInsert>) {
  const [jobTitle] = await db.update(jobTitles).set({ ...input, updatedAt: new Date() }).where(eq(jobTitles.id, id)).returning();
  if (!jobTitle) throw new AppError(404, "Job title not found");
  return jobTitle;
}
export async function remove(id: string) { return update(id, { isActive: false }); }