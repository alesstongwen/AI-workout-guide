import { db, workouts } from '$lib/db';
import { json } from '@sveltejs/kit';

// Get all logged workouts
export async function GET() {
    try {
        const allWorkouts = await db.select().from(workouts);
        return json(allWorkouts);
    } catch (error) {
        console.error("Error fetching workouts:", error);
        return json({ error: "Failed to fetch workouts" }, { status: 500 });
    }
}

// Add a new workout
export async function POST({ request }) {
    try {
        const { name } = await request.json();
        if (!name) return json({ error: "Workout name is required" }, { status: 400 });

        const [newWorkout] = await db.insert(workouts).values({ 
            name, 
            date: new Date().toISOString().split("T")[0] // YYYY-MM-DD format
        }).returning();

        return json(newWorkout);
    } catch (error) {
        console.error("Error adding workout:", error);
        return json({ error: "Failed to add workout" }, { status: 500 });
    }
}
