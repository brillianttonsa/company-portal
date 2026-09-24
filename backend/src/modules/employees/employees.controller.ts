import type { Request, Response } from "express";
import * as service from "./employees.service.js";

export async function list(req: Request, res: Response) { 
    res.json(await service.list(req.query as unknown as { page: number; pageSize: number; search?: string })); 
}
export async function get(req: Request, res: Response) { 
    res.json({ employee: await service.get(req.params.id as string) }); 
}
export async function mine(req: Request, res: Response) { 
    res.json({ employee: await service.getMine(req.user!.id) }); 
}
export async function create(req: Request, res: Response) { 
    res.status(201).json({ employee: await service.create(req.body) }); 
}
export async function update(req: Request, res: Response) { 
    res.json({ employee: await service.update(req.params.id as string, req.body) }); 
}