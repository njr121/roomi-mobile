import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";

async function main() {
  const accommodation = await prisma.accommodation.findFirst({ include: { rooms: true } });
  if (!accommodation) throw new Error("숙소 데이터가 없습니다");
  if (accommodation.rooms.length === 0) throw new Error("객실 데이터가 없습니다");

  const user = await prisma.user.findFirst();
  if (!user) throw new Error("유저 데이터가 없습니다");

  const checkIn = new Date("2026-08-01T00:00:00.000Z");
  const checkOut = new Date("2026-08-03T00:00:00.000Z");

  console.log(`테스트 대상 숙소: ${accommodation.name} (${accommodation.location}), 객실 ${accommodation.rooms.length}개`);

  const createdIds: string[] = [];

  try {
    for (const room of accommodation.rooms) {
      const booking = await prisma.booking.create({
        data: {
          userId: user.id,
          roomId: room.id,
          checkIn,
          checkOut,
          guests: 1,
          totalPrice: 100000,
        },
      });
      createdIds.push(booking.id);
    }
    console.log(`임시 예약 ${createdIds.length}건 생성 완료 (모든 객실 점유)`);

    const url = `${BASE_URL}/api/accommodations?region=${encodeURIComponent(accommodation.location)}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&limit=50`;
    const response = await fetch(url);
    const json = await response.json();
    const items: { id: string }[] = json.data?.data ?? [];
    const found = items.some((item) => item.id === accommodation.id);

    if (found) {
      console.log("검증 실패: 모든 객실이 예약됐는데도 숙소가 검색 결과에 남아있습니다.");
    } else {
      console.log("검증 성공: 모든 객실이 예약된 숙소가 검색 결과에서 정상적으로 제외됐습니다.");
    }
  } finally {
    if (createdIds.length > 0) {
      await prisma.booking.deleteMany({ where: { id: { in: createdIds } } });
      console.log("임시 예약 정리 완료");
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
