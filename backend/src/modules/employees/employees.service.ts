import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../database/client.js";
import { departmentJobTitles, departments, employees, jobTitles, roles, users } from "../../database/schema/index.js";
import { AppError } from "../../shared/errors.js";
import { pageMeta } from "../../shared/pagination.js";
import type { Role } from "../../config/roles.js";
import { presentUser } from "../users/user.presenter.js";

async function ensureReferences(input: { userId?: string; departmentId?: string; jobTitleId?: string }) {
  if (input.userId) {
    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.id, input.userId)).limit(1);
    if (!user) throw new AppError(400, "A valid userId is required");
  }
  if (input.departmentId) {
    const [department] = await db.select({ id: departments.id }).from(departments).where(eq(departments.id, input.departmentId)).limit(1);
    if (!department) throw new AppError(400, "A valid departmentId is required");
  }
  if (input.jobTitleId) {
    const [jobTitle] = await db.select({ id: jobTitles.id }).from(jobTitles).where(eq(jobTitles.id, input.jobTitleId)).limit(1);
    if (!jobTitle) throw new AppError(400, "A valid jobTitleId is required");
  }
  if (input.departmentId && input.jobTitleId) {
    const [assignment] = await db.select().from(departmentJobTitles).where(and(eq(departmentJobTitles.departmentId, input.departmentId), eq(departmentJobTitles.jobTitleId, input.jobTitleId))).limit(1);
    if (!assignment) throw new AppError(400, "The job title is not assigned to this department");
  }
}

async function getEmployee(id: string) {
  const [row] = await db.select({ employee: employees, user: users, role: roles, department: departments, jobTitle: jobTitles })
    .from(employees).innerJoin(users, eq(employees.userId, users.id)).innerJoin(roles, eq(users.roleId, roles.id))
    .innerJoin(departments, eq(employees.departmentId, departments.id)).innerJoin(jobTitles, eq(employees.jobTitleId, jobTitles.id))
    .where(eq(employees.id, id)).limit(1);
  if (!row) throw new AppError(404, "Employee not found");
  return { ...row.employee, user: presentUser(row.user, row.role.name as Role), department: row.department, jobTitle: row.jobTitle };
}

export async function list(input: { page: number; pageSize: number; search?: string }) {
  const where = input.search ? or(ilike(employees.firstName, `%${input.search}%`), ilike(employees.lastName, `%${input.search}%`), ilike(jobTitles.name, `%${input.search}%`)) : undefined;
  const [totalRows, rows] = await Promise.all([
    db.select({ total: count() }).from(employees).innerJoin(jobTitles, eq(employees.jobTitleId, jobTitles.id)).where(where),
    db.select({ employee: employees, user: users, role: roles, department: departments, jobTitle: jobTitles }).from(employees)
      .innerJoin(users, eq(employees.userId, users.id)).innerJoin(roles, eq(users.roleId, roles.id)).innerJoin(departments, eq(employees.departmentId, departments.id)).innerJoin(jobTitles, eq(employees.jobTitleId, jobTitles.id))
      .where(where).orderBy(asc(employees.lastName)).limit(input.pageSize).offset((input.page - 1) * input.pageSize),
  ]);
  return { employees: rows.map((row) => ({ ...row.employee, user: presentUser(row.user, row.role.name as Role), department: row.department, jobTitle: row.jobTitle })), meta: pageMeta(input.page, input.pageSize, Number(totalRows[0]?.total ?? 0)) };
}

export async function create(input: typeof employees.$inferInsert) {
  await ensureReferences(input);
  const [existing] = await db.select({ id: employees.id }).from(employees).where(eq(employees.userId, input.userId)).limit(1);
  if (existing) throw new AppError(409, "This user already has an employee profile");
  const [employee] = await db.insert(employees).values(input).returning();
  return getEmployee(employee.id);
}
export async function update(id: string, input: Partial<typeof employees.$inferInsert>) { await getEmployee(id); await ensureReferences(input); const [employee] = await db.update(employees).set(input).where(eq(employees.id, id)).returning(); if (!employee) throw new AppError(404, "Employee not found"); return getEmployee(employee.id); }
export function get(id: string) { return getEmployee(id); }
export async function getMine(userId: string) { const [employee] = await db.select({ id: employees.id }).from(employees).where(eq(employees.userId, userId)).limit(1); if (!employee) throw new AppError(404, "Employee profile not found"); return getEmployee(employee.id); }