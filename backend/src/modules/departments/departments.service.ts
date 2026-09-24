import { and, asc, eq } from "drizzle-orm";
import { db } from "../../database/client.js";
import { departmentJobTitles, departments, employees, jobTitles } from "../../database/schema/index.js";
import { AppError } from "../../shared/errors.js";

export async function list() { return db.select().from(departments).orderBy(asc(departments.name)); }

export async function get(id: string) {
  const [department] = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
  if (!department) throw new AppError(404, "Department not found");
  return department;
}

export async function create(input: typeof departments.$inferInsert) {
  const [department] = await db.insert(departments).values(input).returning();
  return department;
}

export async function update(id: string, input: Partial<typeof departments.$inferInsert>) {
  const [department] = await db.update(departments).set({ ...input, updatedAt: new Date() }).where(eq(departments.id, id)).returning();
  if (!department) throw new AppError(404, "Department not found");
  return department;
}

export async function remove(id: string) {
  const [department] = await db.delete(departments).where(eq(departments.id, id)).returning({ id: departments.id });
  if (!department) throw new AppError(404, "Department not found");
}

export async function listEmployees(id: string) {
  await get(id);
  return db.select().from(employees).where(eq(employees.departmentId, id));
}

export async function listJobTitles(id: string) {
  await get(id);
  return db.select({ jobTitle: jobTitles }).from(departmentJobTitles)
    .innerJoin(jobTitles, eq(departmentJobTitles.jobTitleId, jobTitles.id))
    .where(eq(departmentJobTitles.departmentId, id)).orderBy(asc(jobTitles.name));
}

export async function assignJobTitle(departmentId: string, jobTitleId: string) {
  await get(departmentId);
  const [jobTitle] = await db.select().from(jobTitles).where(and(eq(jobTitles.id, jobTitleId), eq(jobTitles.isActive, true))).limit(1);
  if (!jobTitle) throw new AppError(400, "Active job title not found");
  const [assignment] = await db.insert(departmentJobTitles).values({ departmentId, jobTitleId }).returning();
  return assignment;
}

export async function removeJobTitle(departmentId: string, jobTitleId: string) {
  const [assignment] = await db.delete(departmentJobTitles).where(and(eq(departmentJobTitles.departmentId, departmentId), eq(departmentJobTitles.jobTitleId, jobTitleId))).returning();
  if (!assignment) throw new AppError(404, "Department job title assignment not found");
}