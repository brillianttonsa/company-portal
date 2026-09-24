import { z } from "zod";

const paginationSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20) });
export function pagination(query: unknown) { const { page, pageSize } = paginationSchema.parse(query); return { page, pageSize, offset: (page - 1) * pageSize }; }
export function pageMeta(page: number, pageSize: number, total: number) { return { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }; }
