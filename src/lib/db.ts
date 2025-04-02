import { createClient } from "@libsql/client";

export const db = createClient({
	url: process.env.TURSO_DB_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN
});
