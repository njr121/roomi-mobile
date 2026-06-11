import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const types = ["hotel", "motel", "pension", "resort"];

const basePrices: Record<string, number> = {
  hotel: 250000,
  motel: 80000,
  pension: 120000,
  resort: 300000,
};

async function main() {
  for (const type of types) {
    for (let i = 1; i <= 12; i++) {
      const priceChangeRate = Math.round(Math.random() * 85 - 5);
      const normalPrice = basePrices[type];
      const currentPrice = Math.round(normalPrice * (1 + priceChangeRate / 100));

      const acc = await prisma.accommodation.create({
        data: {
          name: `${type} ${i}호점`,
          type,
          location: "서울",
          description: `${type} 숙소입니다`,
          normalPrice,
          currentPrice,
          priceChangeRate,
          rating: 4.0,
        },
      });

      await prisma.room.createMany({
        data: [
          { accommodationId: acc.id, name: "스탠다드", type: "standard", price: currentPrice, maxGuests: 2 },
          { accommodationId: acc.id, name: "디럭스", type: "deluxe", price: currentPrice + 50000, maxGuests: 3 },
        ],
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
