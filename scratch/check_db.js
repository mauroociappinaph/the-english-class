
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const ex = await prisma.expression.findUnique({
    where: { text: 'worry' }
  });
  console.log('Expression:', JSON.stringify(ex, null, 2));
  process.exit(0);
}

check();
