import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Connect to SQLite database
const client = createClient({
    url: 'file:./data.db' // SQLite database file
});

export const db = drizzle(client);

// Define workouts table
export const workouts = sqliteTable('workouts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    date: text('date').notNull(),
});
