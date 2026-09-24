import type { Request, Response } from "express";
import * as service from "./job-titles.service.js";

export async function list(_req: Request, res: Response) { 
    res.json({ jobTitles: await service.list() }); 
}
export async function get(req: Request, res: Response) { 
    res.json({ jobTitle: await service.get(req.params.id as string) }); 
}
export async function create(req: Request, res: Response) { 
    res.status(201).json({ jobTitle: await service.create(req.body) }); 
}
export async function update(req: Request, res: Response) { 
    res.json({ jobTitle: await service.update(req.params.id as string, req.body) }); 
}
export async function remove(req: Request, res: Response) { 
    res.json({ jobTitle: await service.remove(req.params.id as string) }); 
}