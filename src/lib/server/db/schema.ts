import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	age: integer('age')
});

export const workouts = sqliteTable('workouts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    date: text('date').notNull()
});
