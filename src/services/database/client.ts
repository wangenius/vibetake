import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

dotenv.config();

const url = process.env.DB_FILE_NAME;
const authToken = process.env.DB_AUTH_TOKEN;

const client = createClient({
  url: url!,
  authToken,
});

export const db = drizzle(client);
