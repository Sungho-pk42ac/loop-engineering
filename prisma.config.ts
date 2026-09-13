import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  // .env 가 없는 환경(CI)에서도 generate/migrate 가 돌도록 기본값을 둔다.
  datasource: { url: process.env.DATABASE_URL ?? "file:./dev.db" },
});
