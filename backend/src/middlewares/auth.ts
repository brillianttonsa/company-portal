import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { Role } from "../config/roles.js";
import { AppError } from "../shared/errors.js";

export type AuthUser = { id: string; email: string; roleId: string; role: Role };
declare global { namespace Express { interface Request { user?: AuthUser } } }

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.header("authorization")?.trim();
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim().replace(/^['"]|['"]$/g, "");
  if (!token) return next(new AppError(401, "Authentication is required"));
  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) return next(new AppError(401, "Token expired; please log in again"));
    if (error instanceof jwt.JsonWebTokenError) return next(new AppError(401, "Invalid token; use the token returned by this API instance"));
    next(new AppError(401, "Invalid or expired token"));
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return next(new AppError(403, "You are not allowed to perform this action"));
    next();
  };
}
