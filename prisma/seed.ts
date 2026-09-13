import { prisma } from "../src/lib/prisma";
import { products } from "./products";

async function main() {
  await prisma.product.createMany({ data: products });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
