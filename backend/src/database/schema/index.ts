import { pgTable, text, timestamp, uuid, varchar, boolean, primaryKey } from "drizzle-orm/pg-core";


// department entity
export const departments = pgTable("departments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

// users entity
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

// jobTitles entity
export const jobTitles = pgTable("job_titles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 100 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

// employees entity
export const employees = pgTable("employees", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  employeeNumber: text("employee_number").unique().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  jobTitleId: uuid("job_title_id").notNull().references(() => jobTitles.id, { onDelete: "restrict" }),
  departmentId: uuid("department_id").notNull().references(() => departments.id, { onDelete: "restrict" }),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  hiredAt: timestamp("hired_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})


// roles entity
export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", {length: 50}).notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}) 

// junction table department and jobs
export const departmentJobTitles = pgTable(
  "department_job_titles",
  {
    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "cascade" }),

    jobTitleId: uuid("job_title_id")
      .notNull()
      .references(() => jobTitles.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.departmentId, table.jobTitleId],
    }),
  ],
);

