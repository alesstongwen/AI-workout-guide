import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { message } = await request.json();
        console.log("Received user message:", message);

        // Mock response instead of calling OpenAI
        const mockData = {
            choices: [
                { message: { content: `Mocked AI Workout Response: Try 3 sets of push-ups, squats, and jumping jacks!` } }
            ]
        };

        console.log("Mocked AI Response:", mockData);
        return json(mockData);
    } catch (error) {
        console.error("Server Error:", error);
        return json({ error: "Internal server error" }, { status: 500 });
    }
}
