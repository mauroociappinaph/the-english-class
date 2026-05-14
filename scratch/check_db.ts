
import { prisma } from '../src/backend/infrastructure/db';

async function check() {
  try {
    const ex = await prisma.expression.findUnique({
      where: { text: 'worry' }
    });
    console.log('Expression:', JSON.stringify(ex, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

check();
