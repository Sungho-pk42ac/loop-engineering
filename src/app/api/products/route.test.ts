// @vitest-environment node
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { products } from "../../../../prisma/products";

// 실제 SQLite 파일 DB에 마이그레이션·시드 후 API 라우트가 그대로 내려주는지 검증하는 통합 테스트.
const TEST_DB = "test.db";
process.env.DATABASE_URL = `file:./${TEST_DB}`;

describe("GET /api/products", () => {
  beforeAll(async () => {
    execSync("pnpm exec prisma migrate deploy", { env: process.env, stdio: "ignore" });
    const { prisma } = await import("@/lib/prisma");
    await prisma.product.createMany({ data: products });
  });

  afterAll(async () => {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$disconnect();
    for (const f of [TEST_DB, `${TEST_DB}-journal`]) rmSync(f, { force: true });
  });

  it("DB에 저장된 상품 6개를 id 순 JSON 배열로 응답한다", async () => {
    const { GET } = await import("./route");

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(body).toEqual(products);
    expect(body).toHaveLength(6);
  });
});
