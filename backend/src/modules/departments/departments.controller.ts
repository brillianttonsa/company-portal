import type { Request, Response } from "express";
import * as service from "./departments.service.js";

export async function list(_req: Request, res: Response) { 
    res.json({ departments: await service.list() }); 
}
export async function get(req: Request, res: Response) { 
    res.json({ department: await service.get(req.params.id as string) }); 
}
export async function create(req: Request, res: Response) { 
    res.status(201).json({ department: await service.create(req.body) }); 
}
export async function update(req: Request, res: Response) { 
    res.json({ department: await service.update(req.params.id as string, req.body) }); 
}
export async function remove(req: Request, res: Response) { 
    await service.remove(req.params.id as string); res.status(204).send(); 
}
export async function employees(req: Request, res: Response) { 
    res.json({ employees: await service.listEmployees(req.params.id as string) }); 
}
export async function jobTitles(req: Request, res: Response) { 
    res.json({ jobTitles: (await service.listJobTitles(req.params.id as string)).map(({ jobTitle }) => jobTitle) }); 
}
export async function assignJobTitle(req: Request, res: Response) { 
    res.status(201).json({ assignment: await service.assignJobTitle(req.params.id as string, req.body.jobTitleId) }); 
}
export async function removeJobTitle(req: Request, res: Response) { 
    await service.removeJobTitle(req.params.id as string, req.params.jobTitleId as string); res.status(204).send(); 
}