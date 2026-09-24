import { authenticate, authorize } from "../../middlewares/auth.js";
import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { validateBody, validateParams } from "../../shared/validate.js";
import * as controller from "./auth.controller.js";
import { credentialsSchema, createUserSchema, updateUserSchema, userIdParamsSchema } from "./auth.validation.js";

const router = Router();
router.post("/login", validateBody(credentialsSchema), asyncHandler(controller.login));
router.use(authenticate);
router.get("/me", asyncHandler(controller.me));
router.get("/users", authorize("ADMIN"), asyncHandler(controller.listUsers));
router.post("/users", authorize("ADMIN"), validateBody(createUserSchema), asyncHandler(controller.createUser));
router.get("/users/:id", authorize("ADMIN"), validateParams(userIdParamsSchema), asyncHandler(controller.getUser));
router.patch("/users/:id", authorize("ADMIN"), validateParams(userIdParamsSchema), validateBody(updateUserSchema), asyncHandler(controller.updateUser));

export default router;
