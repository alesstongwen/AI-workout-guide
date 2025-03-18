import { defineConfig } from 'drizzle-kit';
import path from 'path';

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  dbCredentials: {
    url: `file:${path.resolve(__dirname, 'data.db')}`
  },
  verbose: true,
  strict: true,
  dialect: 'sqlite'
});