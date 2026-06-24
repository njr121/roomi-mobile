import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ErrorCode } from "@/lib/errors";
import { z } from "zod";

const CreateBookingSchema = z.object({
  roomId: z.string(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().int().min(1),
});

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const body = await request.json();
  const parsed = CreateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(ErrorCode.VALIDATION_ERROR, "잘못된 쿼리 파라미터입니다", 400);
  }

  const room = await prisma.room.findUnique({
    where: { id: parsed.data.roomId },
  });
  if (!room) {
    return apiError(ErrorCode.NOT_FOUND, "객실을 찾을 수 없습니다", 404);
  }
  if (new Date(parsed.data.checkIn) >= new Date(parsed.data.checkOut)) {
    return apiError(ErrorCode.VALIDATION_ERROR, "체크아웃은 체크인보다 이후여야 합니다", 400);
  }

  const nights = (new Date(parsed.data.checkOut).getTime() - new Date(parsed.data.checkIn).getTime()) / (1000 * 60 * 60 * 24);
  const totalPrice = Math.round(room.price * nights);

  try {
    const booking = await prisma.$transaction(
      async (tx) => {
        const conflict = await tx.booking.findFirst({
          where: {
            roomId: parsed.data.roomId,
            checkIn: { lt: new Date(parsed.data.checkOut) },
            checkOut: { gt: new Date(parsed.data.checkIn) },
          },
        });
        if (conflict) {
          throw new Error("BOOKING_CONFLICT");
        }
        return tx.booking.create({
          data: {
            userId: authResult,
            roomId: parsed.data.roomId,
            checkIn: new Date(parsed.data.checkIn),
            checkOut: new Date(parsed.data.checkOut),
            totalPrice,
            guests: parsed.data.guests,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
    return apiSuccess(booking);
  } catch (error) {
    const isConflict =
      (error instanceof Error && error.message === "BOOKING_CONFLICT") ||
      (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034");
    if (isConflict) {
      return apiError(ErrorCode.CONFLICT, "이미 예약된 날짜입니다", 409);
    }
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const bookings = await prisma.booking.findMany({
    where: { userId: authResult },
    include: { room: { include: { accommodation: true } } },
    orderBy: { createdAt: "desc" },
  });
  return apiSuccess(bookings);
}
