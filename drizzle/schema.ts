import { sqliteTable, AnySQLiteColumn, integer } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const user = sqliteTable("user", {
	id: integer().primaryKey().notNull(),
	age: integer(),
});

