import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { goal, level, daysPerWeek, duration } = body;

		if (!goal || !level || !daysPerWeek || !duration) {
			return new Response('Missing required fields', { status: 400 });
		}

		// ✅ safe string methods
		const prompt = `Create a workout plan for someone who wants to ${goal.toLowerCase()}, is a ${level.toLowerCase()} level, can work out ${daysPerWeek} days a week, and has about ${duration} minutes per session.`;

		const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'llama3-8b-8192',
				messages: [{ role: 'user', content: prompt }],
				stream: false
			})
		});

		if (!response.ok) {
			const err = await response.text();
			console.error("Groq API error:", err);
			return new Response('Failed to connect to Groq', { status: 500 });
		}

		const data = await response.json();
		return new Response(JSON.stringify({ message: data.choices?.[0]?.message?.content || "No response" }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error("API /chatgpt Error:", err);
		return new Response('Server error', { status: 500 });
	}
};
