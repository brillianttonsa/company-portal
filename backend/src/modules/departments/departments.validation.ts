import { z } from "zod";

export const idParamsSchema = z.object({ id: z.string().uuid() });
export const departmentSchema = z.object({ name: z.string().trim().min(2).max(100), description: z.string().trim().max(500).nullable().optional() });
export const departmentUpdateSchema = departmentSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field is required");
export const jobTitleAssignmentSchema = z.object({ jobTitleId: z.string().uuid() });