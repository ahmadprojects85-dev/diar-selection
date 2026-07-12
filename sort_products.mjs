import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany();
  
  let updatedCount = 0;

  for (const product of products) {
    let targetCategory = null;
    const name = product.name.toLowerCase();

    if (name.includes('grinder')) targetCategory = categories.find(c => c.name === 'Grinders');
    else if (name.includes('scale')) targetCategory = categories.find(c => c.name === 'Scales');
    else if (name.includes('kettle')) targetCategory = categories.find(c => c.name === 'Kettles');
    else if (name.includes('brewer') || name.includes('dripper') || name.includes('v60') || name.includes('aeropress')) targetCategory = categories.find(c => c.name === 'Brewers');
    else if (name.includes('filter')) targetCategory = categories.find(c => c.name === 'Filters');
    else if (name.includes('tamper') || name.includes('pitcher') || name.includes('canister') || name.includes('wdt') || name.includes('cup') || name.includes('knock box') || name.includes('server')) targetCategory = categories.find(c => c.name === 'Accessories');
    
    // For anything else (like coffee beans, pos machines), maybe put in Accessories or leave it.
    if (!targetCategory) {
      targetCategory = categories.find(c => c.name === 'Accessories');
    }

    if (targetCategory && product.categoryId !== targetCategory.id) {
      await prisma.product.update({
        where: { id: product.id },
        data: { categoryId: targetCategory.id }
      });
      console.log(`Moved ${product.name} to ${targetCategory.name}`);
      updatedCount++;
    }
  }

  console.log(`Finished sorting ${updatedCount} products.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
