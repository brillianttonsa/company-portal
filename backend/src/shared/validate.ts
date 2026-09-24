import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => { req.body = schema.parse(req.body); next(); };
}

export function validateParams(schema: ZodType): RequestHandler {
  return (req, _res, next) => { req.params = schema.parse(req.params); next(); };
}

export function validateQuery(schema: ZodType): RequestHandler {
  return (req, _res, next) => { req.query = schema.parse(req.query); next(); };
}