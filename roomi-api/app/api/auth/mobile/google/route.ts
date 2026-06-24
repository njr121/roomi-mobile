import { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ErrorCode } from "@/lib/errors";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return apiError(ErrorCode.VALIDATION_ERROR, "idToken이 필요합니다", 400);
  }

  const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);

  if (!googleResponse.ok) {
    return apiError(ErrorCode.UNAUTHORIZED, "유효하지 않은 구글 토큰입니다", 401);
  }

  const googleData = await googleResponse.json();
  const user = await prisma.user.upsert({
    where: { email: googleData.email },
    update: { name: googleData.name ?? "" },
    create: {
      email: googleData.email,
      name: googleData.name ?? "",
      provider: "google",
    },
  });

  const secret = new TextEncoder().encode(env.MOBILE_JWT_SECRET);
  const token = await new SignJWT({ userId: user.id }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(secret);

  return apiSuccess({ token, user });
}
