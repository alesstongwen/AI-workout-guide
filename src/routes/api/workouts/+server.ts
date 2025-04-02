import { json } from "@sveltejs/kit";
import { db } from "$lib/db";


// GET all workouts
export async function GET() {
	try {
		const result = await db.execute("SELECT * FROM workouts");
		return json(result.rows);
	} catch (error) {
		console.error("Error fetching workouts:", error);
		return json({ error: "Database error" }, { status: 500 });
	}
}

// POST new workout
export async function POST({ request }) {
	const { name } = await request.json();
	if (!name) return json({ error: "Workout name is required" }, { status: 400 });

	try {
		await db.execute({
			sql: "INSERT INTO workouts (name, date) VALUES (?, ?)",
			args: [name, new Date().toLocaleDateString()],
		});
		return json({ success: true });
	} catch (error) {
		console.error("Insert error:", error);
		return json({ error: "Failed to insert workout" }, { status: 500 });
	}
}
