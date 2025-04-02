import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

  const { goal, level, daysPerWeek, duration } = body;

  if (!goal || !level || !daysPerWeek || !duration) {
    console.error("Missing fields", { goal, level, daysPerWeek, duration });
    return new Response("Missing input fields", { status: 400 });
  }

	const prompt = `Create a workout plan for someone who wants to ${goal.toLowerCase()}, is a ${level.toLowerCase()} level, can work out ${daysPerWeek} days a week, and has about ${duration} minutes per session.`;

	const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: 'llama3-8b-8192',
			messages: [{ role: 'user', content: prompt }],
			stream: false
		})
	});

	if (!groqRes.ok) {
		const errorText = await groqRes.text();
		console.error('Groq API error:', errorText);
		return new Response('Failed to connect to Groq', { status: 500 });
	}

	const result = await groqRes.json();
	const aiMessage = result.choices?.[0]?.message?.content || "No response from Groq.";

	return new Response(JSON.stringify({ message: aiMessage }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
