import { json } from '@sveltejs/kit';

export async function POST({ request }) {

  try {
    const {message} = await request.json();
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: message,
        stream: false
      })
    });

    if(!res.ok) {
      const errText = await res.text();
      console.error('Ollama Error:', errText);
      return json({ error: 'Ollama server error' }, { status: res.status });
    }

    const data = await res.json();
    console.log('Ollama AI response:', data.response);

    return json({ choices: [{ message: { content: data.response } }] });
  } catch (error) {
    console.error('server error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
