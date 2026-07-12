import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log("Categories:", categories.map(c => c.name));
  
  const targetCategory = await prisma.category.findFirst({
    where: { name: "Coffee Equipment" },
    include: { products: true }
  });
  
  if (!targetCategory) {
    console.log("Category not found.");
    return;
  }
  
  console.log("Products in Coffee Equipment:", targetCategory.products.map(p => p.name));
  
  if (targetCategory.products.length > 0) {
    // Re-assign them to another category. Let's use the first one that is NOT Coffee Equipment
    const fallbackCategory = categories.find(c => c.name !== "Coffee Equipment");
    if (fallbackCategory) {
      console.log(`Moving products to ${fallbackCategory.name}`);
      await prisma.product.updateMany({
        where: { categoryId: targetCategory.id },
        data: { categoryId: fallbackCategory.id }
      });
    } else {
      console.log("No other categories found, deleting products");
      await prisma.product.deleteMany({
        where: { categoryId: targetCategory.id }
      });
    }
  }
  
  const result = await prisma.category.delete({
    where: { id: targetCategory.id }
  });
  console.log("Deleted Category:", result.name);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
