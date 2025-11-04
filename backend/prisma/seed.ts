import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding subscription plans...');

  // --- Pro Plan ---
  // IMPORTANT: Replace with your actual Stripe Price ID
  const proPlanStripePriceId = 'price_1SPp3pSRUxkF1lWGHid235wI'; // ⚠️ PASTE YOUR PRICE ID HERE

  if (!proPlanStripePriceId.startsWith('price_')) {
    throw new Error(
      'Invalid Stripe Price ID. Please paste your actual Price ID from the Stripe dashboard into prisma/seed.ts'
    );
  }

  await prisma.plan.upsert({
    where: { stripePriceId: proPlanStripePriceId },
    update: {},
    create: {
      name: 'Pro',
      price: 899,
      stripePriceId: proPlanStripePriceId,
      features: ['Feature A', 'Feature B', 'Feature C'],
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
