import type { Request, Response } from "express";
import * as service from "./auth.service.js";

export async function login(req: Request, res: Response) { 
    res.json(await service.login(req.body)); 
}
export async function createUser(req: Request, res: Response) { 
    res.status(201).json({ user: await service.createUser(req.body) }); 
}
export async function listUsers(_req: Request, res: Response) { 
    res.json({ users: await service.listUsers() }); 
}
export async function getUser(req: Request, res: Response) { 
    res.json({ user: await service.getUser(req.params.id as string) }); 
}
export async function updateUser(req: Request, res: Response) { 
    res.json({ user: await service.updateUser(req.params.id as string, req.body) }); 
}
export async function me(req: Request, res: Response) { 
    res.json({ user: await service.getCurrentUser(req.user!.id) }); 
}