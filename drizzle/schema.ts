import { sqliteTable, AnySQLiteColumn, integer, text } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const user = sqliteTable("user", {
	id: integer().primaryKey().notNull(),
	age: integer(),
});

export const workouts = sqliteTable("workouts", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	date: text().notNull(),
});

