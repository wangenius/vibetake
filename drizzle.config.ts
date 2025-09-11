import type { Config } from "drizzle-kit";

export default {
  schema: "./src/services/database/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
} satisfies Config;
