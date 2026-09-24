import { authenticate, authorize } from "../../middlewares/auth.js";
import { Router } from "express";
import { asyncHandler } from "../../shared/async-handler.js";
import { validateBody, validateParams, validateQuery } from "../../shared/validate.js";
import * as controller from "./employees.controller.js";
import { employeeQuerySchema, employeeSchema, employeeUpdateSchema, idParamsSchema } from "./employees.validation.js";

const router = Router();
router.use(authenticate);
router.get("/me", asyncHandler(controller.mine));
router.get("/", authorize("ADMIN", "HR"), validateQuery(employeeQuerySchema), asyncHandler(controller.list));
router.get("/:id", authorize("ADMIN", "HR"), validateParams(idParamsSchema), asyncHandler(controller.get));
router.post("/", authorize("ADMIN", "HR"), validateBody(employeeSchema), asyncHandler(controller.create));
router.patch("/:id", authorize("ADMIN", "HR"), validateParams(idParamsSchema), validateBody(employeeUpdateSchema), asyncHandler(controller.update));
export default router;
