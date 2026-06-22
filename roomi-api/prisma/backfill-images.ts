import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const colorsByType: Record<string, string> = {
  hotel: "3b82f6/ffffff",
  motel: "f97316/ffffff",
  pension: "22c55e/ffffff",
  resort: "06b6d4/ffffff",
};

async function main() {
  const accommodations = await prisma.accommodation.findMany();

  for (const acc of accommodations) {
    const color = colorsByType[acc.type] ?? "9ca3af/ffffff";
    await prisma.accommodation.update({
      where: { id: acc.id },
      data: { images: [`https://placehold.co/600x400/${color}.png`] },
    });
  }

  console.log(`이미지 채움 완료: ${accommodations.length}개`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
