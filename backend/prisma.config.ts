import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx src/seed.ts",
  },
  datasource: {
    // Client generation does not need a live database. Migrations still use .env.
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/garantiy_aid",
  },
});
