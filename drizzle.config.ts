import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config();

function getConfig() {
  return {
    schema: "./src/services/database/schema.ts",
    out: "./drizzle/postgres",
    dialect: "postgresql" as const,
    dbCredentials: {
      url: process.env.DATABASE_URL!,
    },
  };
}

export default defineConfig(getConfig());
