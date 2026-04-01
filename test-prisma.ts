import { PrismaClient } from '@prisma/client';

async function test() {
  const prisma = new PrismaClient();
  try {
    console.log('Connecting...');
    await prisma.$connect();
    console.log('Connected!');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Users found:', users.length);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
