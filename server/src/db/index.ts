
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

let dbInstance: ReturnType<typeof drizzle> | null = null;

export const getDB = (): ReturnType<typeof drizzle> => {
  if (!dbInstance) {
    if (!process.env.DB_FILE_NAME) {
      throw new Error('DB_FILE_NAME not defined in .env');
    }
    dbInstance = drizzle(process.env.DB_FILE_NAME);
  }
  return dbInstance;
};