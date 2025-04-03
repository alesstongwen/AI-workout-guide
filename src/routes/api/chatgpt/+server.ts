import { GROQ_API_KEY } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	// Create an array to collect debug information
	const debugInfo = [];
	
	try {
		debugInfo.push('Request received');
		
		// Check API key first
		if (!GROQ_API_KEY) {
			console.error('GROQ_API_KEY is missing or empty');
			return new Response('API key not configured', { status: 500 });
		}
		
		debugInfo.push('API key check passed');
		
		// Parse request body
		let body;
		try {
			body = await request.json();
			debugInfo.push('Request body parsed successfully');
		} catch (err) {
			console.error('Failed to parse request body:', err);
			return new Response('Invalid request format', { status: 400 });
		}
		
		const { goal, level, daysPerWeek, duration } = body;
		
		// Validate required fields
		if (!goal || !level || !daysPerWeek || !duration) {
			console.error('Missing required fields:', { goal, level, daysPerWeek, duration });
			return new Response('Missing required fields', { status: 400 });
		}
		
		debugInfo.push('All required fields present');
		
		// Prepare prompt
		const prompt = `Create a workout plan for someone who wants to ${goal.toLowerCase()}, is a ${level.toLowerCase()} level, can work out ${daysPerWeek} days a week, and has about ${duration} minutes per session.`;
		debugInfo.push('Prompt prepared');
		
		// Make API request to Groq
		debugInfo.push('Attempting Groq API request');
		const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${GROQ_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'llama3-8b-8192',
				messages: [{ role: 'user', content: prompt }],
				stream: false
			})
		}).catch(err => {
			// Catch network errors
			console.error('Network error when contacting Groq API:', err);
			debugInfo.push(`Fetch error: ${err.message}`);
			return null;
		});
		
		// Check if fetch failed completely
		if (!response) {
			return new Response(JSON.stringify({ 
				error: 'Network error when connecting to Groq API',
				debug: debugInfo
			}), { 
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		debugInfo.push(`Groq API response status: ${response.status}`);
		
		// Handle non-OK responses
		if (!response.ok) {
			let errorText;
			try {
				errorText = await response.text();
				debugInfo.push(`Error response from Groq: ${errorText}`);
			} catch (e) {
				errorText = 'Unable to extract error details';
				debugInfo.push('Could not extract error text from Groq response');
			}
			
			console.error('Groq API error:', errorText);
			return new Response(JSON.stringify({
				error: 'Failed to connect to Groq API',
				status: response.status,
				details: errorText,
				debug: debugInfo
			}), { 
				status: 502, // Using 502 Bad Gateway for external API failures
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Parse API response
		debugInfo.push('Parsing Groq response');
		let data;
		try {
			data = await response.json();
			debugInfo.push('Response parsed successfully');
		} catch (err) {
			console.error('Failed to parse Groq API response:', err);
			return new Response(JSON.stringify({
				error: 'Failed to parse Groq API response',
				debug: debugInfo
			}), { 
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Extract message content
		const messageContent = data.choices?.[0]?.message?.content;
		if (!messageContent) {
			console.error('No message content in Groq response:', data);
			return new Response(JSON.stringify({
				error: 'No message content in Groq response',
				data,
				debug: debugInfo
			}), { 
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		debugInfo.push('Successfully extracted message content');
		
		// Success response
		return new Response(JSON.stringify({ 
			message: messageContent,
			debug: debugInfo 
		}), {
			headers: { 'Content-Type': 'application/json' }
		});
		
	} catch (err) {
		// Handle any unexpected errors
		const errorMessage = err instanceof Error ? err.message : String(err);
		console.error('Unexpected error in /api/chatgpt:', errorMessage);
		
		return new Response(JSON.stringify({
			error: 'Server error',
			message: errorMessage,
			debug: [...debugInfo, `Fatal error: ${errorMessage}`]
		}), { 
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};