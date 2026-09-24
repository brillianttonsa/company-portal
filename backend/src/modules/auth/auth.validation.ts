import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
});
export const createUserSchema = credentialsSchema.extend({ role: z.enum(["ADMIN", "HR", "MANAGER", "EMPLOYEE"]).default("EMPLOYEE") });
export const updateUserSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()).optional(),
  role: z.enum(["ADMIN", "HR", "MANAGER", "EMPLOYEE"]).optional(),
  password: z.string().min(8).max(72).optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");
export const userIdParamsSchema = z.object({ id: z.string().uuid() });