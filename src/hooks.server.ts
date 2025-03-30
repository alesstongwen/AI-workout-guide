import { handleAuth } from '@kinde-oss/kinde-auth-sveltekit';
import type { Handle } from '@sveltejs/kit';

// Create a handle function that properly delegates auth requests
export const handle: Handle = async ({ event, resolve }) => {
  // Check if this is an auth-related route
  if (event.url.pathname.startsWith('/api/auth/')) {
    try {
      // Pass the entire event to handleAuth
      return await handleAuth(event);
    } catch (error) {
      console.error('Auth handling error:', error);
      return new Response('Authentication error', { status: 500 });
    }
  }
  
  // For non-auth routes, continue with the regular flow
  return resolve(event);
};