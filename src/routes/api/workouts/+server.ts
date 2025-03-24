import { json } from "@sveltejs/kit";
import { db, workouts } from "$lib/db";

export async function GET() {
    try {
        const allWorkouts = await db.select().from(workouts);
        return json(allWorkouts);
    } catch (error) {
        console.error("Error fetching workouts:", error);
        return json({ error: "Database error" }, { status: 500 });
    }
}

export async function POST({ request }) {
    const { name } = await request.json();
    if (!name) return json({ error: "Workout name is required" }, { status: 400 });

    await db.insert(workouts).values({ name, date: new Date().toLocaleDateString() });

    return json({ success: true });
}
