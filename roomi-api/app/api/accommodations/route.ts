import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ErrorCode } from "@/lib/errors";

const QuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  type: z.enum(["hotel", "motel", "pension", "resort"]).optional(),
  sort: z.string().default("priceChangeRate"),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = {
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  };

  const parsed = QuerySchema.safeParse(query);
  if (!parsed.success) {
    return apiError(ErrorCode.VALIDATION_ERROR, "잘못된 쿼리 파라미터입니다", 400);
  }

  const { page, limit, type, sort } = parsed.data;
  const skip = (page - 1) * limit;

  const where = type ? { type } : {};

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
