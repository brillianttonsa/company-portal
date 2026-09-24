import type { Role } from "../../config/roles.js";
import type { users } from "../../database/schema/index.js";

export function presentUser(user: typeof users.$inferSelect, role?: Role) {
  const { passwordHash, ...safeUser } = user;
  return role ? { ...safeUser, role } : safeUser;
}
