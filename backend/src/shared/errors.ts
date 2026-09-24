import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(public statusCode: number, message: string) { super(message); }
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, "Route not found"));
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) return res.status(400).json({ message: "Invalid request", errors: error.flatten() });
  if (error instanceof AppError) return res.status(error.statusCode).json({ message: error.message });
  if ("code" in error && error.code === "23505") return res.status(409).json({ message: "A record with this value already exists" });
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
