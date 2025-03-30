import { TextEncoderStream } from 'node:stream/web';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { message } = await request.json();

	const ollamaRes = await fetch('http://localhost:11434/api/generate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: 'mistral',
			prompt: message,
			stream: true
		})
	});

	if (!ollamaRes.ok || !ollamaRes.body) {
		return new Response('Failed to connect to Ollama', { status: 500 });
	}

	// Create a readable stream from Ollama’s response
	const decoder = new TextDecoder();
	const encoder = new TextEncoderStream();
	const writer = encoder.writable.getWriter();

	const reader = ollamaRes.body.getReader();

	async function read() {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value, { stream: true });

			for (const line of chunk.split('\n')) {
				if (!line.trim()) continue;

				try {
					const parsed = JSON.parse(line);
					await writer.write(parsed.response || '');
				} catch (e) {
					console.error('Streaming JSON parse error:', e, line);
				}
			}
		}
		writer.close();
	}

	read();

	return new Response(encoder.readable as unknown as BodyInit, {
		headers: {
			'Content-Type': 'text/plain',
			'Transfer-Encoding': 'chunked'
		}
	});
};
