import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ErrorCode } from "@/lib/errors";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id, userId: authResult },
  });
  if (!booking) {
    return apiError(ErrorCode.NOT_FOUND, "예약을 찾을 수 없습니다", 404);
  }
  if (booking.status === "CANCELLED") {
    return apiError(ErrorCode.VALIDATION_ERROR, "이미 취소된 예약입니다", 400);
  }
  const cancelled = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  return apiSuccess(cancelled);
}
