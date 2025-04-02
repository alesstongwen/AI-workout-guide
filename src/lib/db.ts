import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createClient } from "@libsql/client";

export const workouts = sqliteTable("workouts", {
	name: text("name").notNull(),
	date: text("date").notNull()
});

export const db = createClient({
	url: process.env.TURSO_DB_URL!,
	authToken: process.env.TURSO_DB_AUTH_TOKEN!
});
