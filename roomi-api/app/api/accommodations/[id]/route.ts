import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ErrorCode } from "@/lib/errors";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accommodation = await prisma.accommodation.findUnique({
    where: { id },
    include: { rooms: true },
  });
  if (!accommodation) {
    return apiError(ErrorCode.NOT_FOUND, "숙소를 찾을 수 없습니다", 404);
  }
  return apiSuccess(accommodation);
}
