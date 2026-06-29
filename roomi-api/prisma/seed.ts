import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const types = ["hotel", "motel", "pension", "resort"];
const locations = ["서울", "부산", "인천", "강원", "경주", "제주"];

const basePrices: Record<string, number> = {
  hotel: 250000,
  motel: 80000,
  pension: 120000,
  resort: 300000,
};

const colorsByType: Record<string, string> = {
  hotel: "3b82f6/ffffff",
  motel: "f97316/ffffff",
  pension: "22c55e/ffffff",
  resort: "06b6d4/ffffff",
};

async function main() {
  await prisma.wishlist.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.accommodation.deleteMany({});

  for (const type of types) {
    for (let i = 1; i <= 12; i++) {
      const priceChangeRate = Math.round(Math.random() * 85 - 5);
      const normalPrice = basePrices[type];
      const currentPrice = Math.round(normalPrice * (1 + priceChangeRate / 100));

      const acc = await prisma.accommodation.create({
        data: {
          name: `${type} ${i}호점`,
          type,
          location: locations[i % locations.length],
          description: `${type} 숙소입니다`,
          normalPrice,
          currentPrice,
          priceChangeRate,
          rating: 4.0,
          images: [],
        },
      });

      await prisma.accommodation.update({
        where: { id: acc.id },
        data: { images: [`https://placehold.co/600x400/${colorsByType[type]}.png`] },
      });

      await prisma.room.createMany({
        data: [
          { accommodationId: acc.id, name: "스탠다드", type: "standard", price: currentPrice, maxGuests: 2 },
          { accommodationId: acc.id, name: "디럭스", type: "deluxe", price: currentPrice + 50000, maxGuests: 3 },
          { accommodationId: acc.id, name: "패밀리", type: "family", price: currentPrice + 100000, maxGuests: 4 },
          { accommodationId: acc.id, name: "스위트", type: "suite", price: currentPrice + 200000, maxGuests: 6 },
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
