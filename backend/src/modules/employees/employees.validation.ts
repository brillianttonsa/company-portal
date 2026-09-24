import { z } from "zod";
export const idParamsSchema = z.object({ id: z.string().uuid() });
export const employeeSchema = z.object({
  userId: z.string().uuid(), employeeNumber: z.string().trim().min(1).max(50), firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80),
  jobTitleId: z.string().uuid(), departmentId: z.string().uuid(), phone: z.string().trim().max(40).nullable().optional(), isActive: z.boolean().optional(), hiredAt: z.coerce.date().optional(),
});
export const employeeUpdateSchema = employeeSchema.omit({ userId: true }).partial().refine((value) => Object.keys(value).length > 0, "At least one field is required");
export const employeeQuerySchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), search: z.string().trim().max(100).optional() });