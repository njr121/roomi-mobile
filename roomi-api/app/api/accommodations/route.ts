import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ErrorCode } from "@/lib/errors";

const QuerySchema = z
  .object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    type: z.enum(["hotel", "motel", "pension", "resort"]).optional(),
    sort: z.string().default("priceChangeRate"),
    region: z.string().optional(),
    checkIn: z.coerce.date().optional(),
    checkOut: z.coerce.date().optional(),
    guests: z.coerce.number().int().min(1).optional(),
  })
  .refine((data) => Boolean(data.checkIn) === Boolean(data.checkOut), {
    message: "checkIn과 checkOut은 함께 보내야 합니다",
  })
  .refine(
    (data) => !data.checkIn || !data.checkOut || data.checkIn < data.checkOut,
    { message: "checkIn은 checkOut보다 이전이어야 합니다" }
  );

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = {
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    region: searchParams.get("region") ?? undefined,
    checkIn: searchParams.get("checkIn") ?? undefined,
    checkOut: searchParams.get("checkOut") ?? undefined,
    guests: searchParams.get("guests") ?? undefined,
  };

  const parsed = QuerySchema.safeParse(query);
  if (!parsed.success) {
    return apiError(ErrorCode.VALIDATION_ERROR, "잘못된 쿼리 파라미터입니다", 400);
  }

  const { page, limit, type, sort, region, checkIn, checkOut, guests } = parsed.data;
  const skip = (page - 1) * limit;

  const roomCondition = {
    ...(guests ? { maxGuests: { gte: guests } } : {}),
    ...(checkIn && checkOut
      ? {
          bookings: {
            none: {
              status: { not: "cancelled" },
              checkIn: { lt: checkOut },
              checkOut: { gt: checkIn },
            },
          },
        }
      : {}),
  };

  const where = {
    ...(type ? { type } : {}),
    ...(region ? { location: { contains: region, mode: "insensitive" as const } } : {}),
    ...(Object.keys(roomCondition).length > 0 ? { rooms: { some: roomCondition } } : {}),
  };

  const [accommodations, total] = await Promise.all([
    prisma.accommodation.findMany({
      where,
      orderBy: { [sort]: "asc" },
      take: limit,
      skip,
    }),
    prisma.accommodation.count({ where }),
  ]);

  return apiSuccess({
    data: accommodations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
