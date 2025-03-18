export async function load({ fetch }) {
    const res = await fetch("/api/workouts");
    const workouts = await res.json();
    return { workouts };
}