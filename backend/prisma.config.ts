import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'ts-node prisma/seed.ts'
  },
  datasource: {
    url: "postgresql://postgres:postgres123@localhost:5432/prescriptions?schema=public",
  },
});