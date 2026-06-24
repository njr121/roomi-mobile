import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ErrorCode } from "@/lib/errors";
import { z } from "zod";

const CreateWishlistSchema = z.object({
  accommodationId: z.string(),
});

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const body = await request.json();

  const parsed = CreateWishlistSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(ErrorCode.VALIDATION_ERROR, "잘못된 입력입니다", 400);
  }

  const wishlist = await prisma.wishlist.findFirst({
    where: {
      userId: authResult,
      accommodationId: parsed.data.accommodationId,
    },
  });
  if (wishlist) {
    return apiError(ErrorCode.WISHLIST_ALREADY_EXISTS, "이미 찜한 숙소입니다", 409);
  }

  const created = await prisma.wishlist.create({
    data: {
      userId: authResult,
      accommodationId: parsed.data.accommodationId,
    },
  });

  return apiSuccess(created);
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const wishlists = await prisma.wishlist.findMany({
    where: { userId: authResult },
    include: { accommodation: true },
    orderBy: { createdAt: "desc" },
  });
  return apiSuccess(wishlists);
}
