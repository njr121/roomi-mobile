import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ErrorCode } from "@/lib/errors";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ accommodationId: string }> }) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { accommodationId } = await params;

  const wishlist = await prisma.wishlist.findFirst({
    where: { userId: authResult, accommodationId },
  });
  if (!wishlist) {
    return apiError(ErrorCode.NOT_FOUND, "찜을 찾을 수 없습니다", 404);
  }
  const deleted = await prisma.wishlist.delete({
    where: { id: wishlist.id },
  });
  return apiSuccess(deleted);
}
