import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ErrorCode } from "@/lib/errors";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id, userId: authResult },
    include: { room: { include: { accommodation: true } } },
  });
  if (!booking) {
    return apiError(ErrorCode.NOT_FOUND, "예약을 찾을 수 없습니다", 404);
  }
  return apiSuccess(booking);
}
