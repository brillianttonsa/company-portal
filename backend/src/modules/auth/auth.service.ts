import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { env } from "../../config/env.js";
import type { Role } from "../../config/roles.js";
import { db } from "../../database/client.js";
import { roles, users } from "../../database/schema/index.js";
import { AppError } from "../../shared/errors.js";
import { presentUser } from "../users/user.presenter.js";

type Credentials = { email: string; password: string };

async function findRole(name: Role) {
  const [role] = await db.select().from(roles).where(eq(roles.name, name)).limit(1);
  if (!role || !role.isActive) throw new AppError(400, `Role ${name} is not available`);
  return role;
}

export async function login(input: Credentials) {
  const [result] = await db.select({ user: users, role: roles }).from(users)
    .innerJoin(roles, eq(users.roleId, roles.id)).where(eq(users.email, input.email)).limit(1);
  if (!result || !result.role.isActive || !(await bcrypt.compare(input.password, result.user.passwordHash))) throw new AppError(401, "Invalid email or password");
  const role = result.role.name as Role;
  const token = jwt.sign({ id: result.user.id, email: result.user.email, roleId: result.user.roleId, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
  return { token, user: presentUser(result.user, role) };
}

export async function createUser(input: Credentials & { role: Role }) {
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, input.email)).limit(1);
  if (existing) throw new AppError(409, "Email is already in use");
  const role = await findRole(input.role);
  const [user] = await db.insert(users).values({ email: input.email, passwordHash: await bcrypt.hash(input.password, 12), roleId: role.id }).returning();
  return presentUser(user, input.role);
}

export async function listUsers() {
  const rows = await db.select({ user: users, role: roles }).from(users).innerJoin(roles, eq(users.roleId, roles.id));
  return rows.map(({ user, role }) => presentUser(user, role.name as Role));
}

export async function getUser(id: string) {
  const [result] = await db.select({ user: users, role: roles }).from(users).innerJoin(roles, eq(users.roleId, roles.id)).where(eq(users.id, id)).limit(1);
  if (!result) throw new AppError(404, "User not found");
  return presentUser(result.user, result.role.name as Role);
}

export async function updateUser(id: string, input: { email?: string; role?: Role; password?: string }) {
  const values: Partial<typeof users.$inferInsert> = {};
  if (input.email) values.email = input.email;
  if (input.password) values.passwordHash = await bcrypt.hash(input.password, 12);
  if (input.role) values.roleId = (await findRole(input.role)).id;
  values.updatedAt = new Date();
  const [user] = await db.update(users).set(values).where(eq(users.id, id)).returning();
  if (!user) throw new AppError(404, "User not found");
  return getUser(user.id);
}

export const getCurrentUser = getUser;