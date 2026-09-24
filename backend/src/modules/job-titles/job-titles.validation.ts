import { z } from "zod";
export const idParamsSchema = z.object({ id: z.string().uuid() });
export const jobTitleSchema = z.object({ name: z.string().trim().min(2).max(50), description: z.string().trim().max(100).nullable().optional() });
export const jobTitleUpdateSchema = jobTitleSchema.partial().extend({ isActive: z.boolean().optional() }).refine((value) => Object.keys(value).length > 0, "At least one field is required");