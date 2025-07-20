import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Todos } from './schema';

const pool = new Pool({
  connectionString: process.env.DB_URL!,
  max: 10,
});

export const db = drizzle(pool, {
  schema: {
    Todos,
  },
});
