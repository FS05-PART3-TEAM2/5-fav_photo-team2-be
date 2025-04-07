// prisma/seeds/seed.ts
import { PrismaClient } from "@prisma/client";

// 1) 각 데이터 배열을 import
import { USER_SEED } from "./user.seed";
import { photoCards } from "./photoCard.seed";
import { userPhotoCards } from "./userPhotoCard.seed";
import { saleCards } from "./saleCard.seed";
import { exchangeOffers } from "./exchangeOffers.seed";
import { notifications } from "./notifications.seed";
import { randomBoxDraws } from "./randombox.seed";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // await prisma.exchangeOffer.deleteMany();
  // await prisma.saleCard.deleteMany();
  // await prisma.userPhotoCard.deleteMany();
  // await prisma.photoCard.deleteMany();
  // await prisma.marketOffer.deleteMany();
  // await prisma.notification.deleteMany();
  // await prisma.randomBoxDraw.deleteMany();
  // await prisma.user.deleteMany();

  // 0. user
  await prisma.user.createMany({
    data: USER_SEED,
    skipDuplicates: true,
  });

  // 1. PhotoCard
  console.log("> Creating PhotoCards...");
  await prisma.photoCard.createMany({
    data: photoCards,
    skipDuplicates: true,
  });

  // 2. UserPhotoCard
  console.log("> Creating UserPhotoCards...");
  await prisma.userPhotoCard.createMany({
    data: userPhotoCards,
    skipDuplicates: true,
  });

  // 3. SaleCard
  console.log("> Creating SaleCards...");
  await prisma.saleCard.createMany({
    data: saleCards,
    skipDuplicates: true,
  });
  await prisma.marketOffer.createMany({
    data: saleCards.map((card) => ({
      saleCardId: card.id,
      type: "SALE",
      ownerId: card.sellerId,
    })),
    skipDuplicates: true,
  });

  // 4. ExchangeOffer
  console.log("> Creating ExchangeOffers...");
  await prisma.exchangeOffer.createMany({
    data: exchangeOffers,
    skipDuplicates: true,
  });
  await prisma.marketOffer.createMany({
    data: exchangeOffers.map((card) => ({
      exchangeOfferId: card.id,
      type: "EXCHANGE",
      ownerId: card.offererId,
    })),
    skipDuplicates: true,
  });

  // 5. Notification
  console.log("> Creating Notifications...");
  await prisma.notification.createMany({
    data: notifications,
    skipDuplicates: true,
  });

  // 7. RandomBoxDraw
  console.log("> Creating RandomBoxDraws...");
  await prisma.randomBoxDraw.createMany({
    data: randomBoxDraws,
    skipDuplicates: true,
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
