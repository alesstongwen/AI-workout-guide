export const kindeConfig = {
	clientId: process.env.KINDE_CLIENT_ID!,
	clientSecret: process.env.KINDE_CLIENT_SECRET!,
	issuerBaseUrl: process.env.KINDE_ISSUER_URL!,
	redirectUri: process.env.KINDE_REDIRECT_URL,
	postLoginRedirectUri: process.env.KINDE_POST_LOGIN_REDIRECT_URL,
	postLogoutRedirectUri: process.env.KINDE_POST_LOGOUT_REDIRECT_URL
};