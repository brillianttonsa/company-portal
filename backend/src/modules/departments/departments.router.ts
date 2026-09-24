import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { asyncHandler } from "../../shared/async-handler.js";
import { validateBody, validateParams } from "../../shared/validate.js";
import * as controller from "./departments.controller.js";
import { departmentSchema, departmentUpdateSchema, idParamsSchema, jobTitleAssignmentSchema } from "./departments.validation.js";

const router = Router();
router.use(authenticate);
router.get("/", asyncHandler(controller.list));
router.get("/:id/employees", validateParams(idParamsSchema), asyncHandler(controller.employees));
router.get("/:id/job-titles", validateParams(idParamsSchema), asyncHandler(controller.jobTitles));
router.delete("/:id/job-titles/:jobTitleId", authorize("ADMIN", "HR"), validateParams(idParamsSchema.extend({ jobTitleId: idParamsSchema.shape.id })), asyncHandler(controller.removeJobTitle));
router.get("/:id", validateParams(idParamsSchema), asyncHandler(controller.get));
router.post("/", authorize("ADMIN", "HR"), validateBody(departmentSchema), asyncHandler(controller.create));
router.patch("/:id", authorize("ADMIN", "HR"), validateParams(idParamsSchema), validateBody(departmentUpdateSchema), asyncHandler(controller.update));
router.delete("/:id", authorize("ADMIN", "HR"), validateParams(idParamsSchema), asyncHandler(controller.remove));
router.post("/:id/job-titles", authorize("ADMIN", "HR"), validateParams(idParamsSchema), validateBody(jobTitleAssignmentSchema), asyncHandler(controller.assignJobTitle));
export default router;
