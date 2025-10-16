/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://user:password@localhost:5432/food_bank',
  },
});
