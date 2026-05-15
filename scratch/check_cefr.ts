
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCefr() {
  const expressions = await prisma.expression.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' }
  });

  console.log("Last 20 expressions CEFR levels:");
  expressions.forEach(e => {
    console.log(`- [${e.cefr || 'N/A'}] ${e.text}`);
  });
}

checkCefr()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
