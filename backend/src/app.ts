import cors from "cors";
import express from "express";
import { env } from "./config/env.js";

// routes
import authRouter from "./modules/auth/auth.router.js";
import departmentRouter from "./modules/departments/departments.router.js";
import employeeRouter from "./modules/employees/employees.router.js";
import jobTitleRouter from "./modules/job-titles/job-titles.router.js";

import { openapi } from "./docs/openapi.js";

// shared
import { errorHandler, notFound } from "./shared/errors.js";

export const app = express();

app.use(cors({ 
    origin: env.CORS_ORIGIN.split(","), 
    credentials: true 
}));

// middlewares
app.use(express.json());

// health-checking
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// api-documentation
app.get("/api-docs.json", (_req, res) => res.json(openapi));

// routes
app.use("/api/v1/auth", authRouter); 
app.use("/api/v1/departments", departmentRouter); 
app.use("/api/v1/job-titles", jobTitleRouter); 
app.use("/api/v1/employees", employeeRouter);


app.use(notFound); 
app.use(errorHandler);
