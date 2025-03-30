import { handleAuth } from '@kinde-oss/kinde-auth-sveltekit';

export const GET = async (event) => {
	return handleAuth(event);
};
