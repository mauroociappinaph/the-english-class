
import { prisma } from '../src/backend/infrastructure/db';

async function check() {
  try {
    const all = await prisma.expression.findMany({
      select: { text: true, id: true }
    });
    console.log('All expressions:', all);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

check();
