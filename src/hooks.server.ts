import { sessionHooks, type Handler } from '@kinde-oss/kinde-auth-sveltekit';
import 'dotenv/config';

export const handle: Handler = async ({ event, resolve }) => {
    sessionHooks({ event });
    const response = await resolve(event);
    return response;
};