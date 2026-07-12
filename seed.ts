import { PrismaClient } from "@prisma/client";
import { products } from "./src/data/products";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default Category
  const category = await prisma.category.upsert({
    where: { slug: "coffee-equipment" },
    update: {},
    create: {
      name: "Coffee Equipment",
      slug: "coffee-equipment",
      description: "Premium coffee brewing equipment",
    },
  });

  // Create default Brand
  const brand = await prisma.brand.upsert({
    where: { slug: "diar-selection" },
    update: {},
    create: {
      name: "Diar Selection",
      slug: "diar-selection",
    },
  });

  // Insert all mock products
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.id },
      update: {},
      create: {
        name: p.name,
        slug: p.id,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice || null,
        currency: "IQD",
        image: p.images[0],
        images: JSON.stringify(p.images),
        categoryId: category.id,
        brandId: brand.id,
        isBestSeller: p.isBestSeller || false,
        isFeatured: p.isFeatured || false,
        inStock: true,
        sortOrder: 0,
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
