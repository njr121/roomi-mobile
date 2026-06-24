import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import { env } from "./env";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { ErrorCode } from "@/lib/errors";
import { headers } from "next/headers";
import { jwtVerify } from "jose";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Kakao({
      clientId: env.KAKAO_CLIENT_ID,
      clientSecret: env.KAKAO_CLIENT_SECRET,
    }),
    Naver({
      clientId: env.NAVER_CLIENT_ID,
      clientSecret: env.NAVER_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name ?? "" },
        create: {
          email: user.email,
          name: user.name ?? "",
          provider: account?.provider ?? null,
        },
      });
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});

export async function requireAuth(): Promise<string | NextResponse> {
  const session = await auth();
  if (session?.user?.id) {
    return session.user.id as string;
  }

  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return apiError(ErrorCode.UNAUTHORIZED, "로그인이 필요합니다", 401);
  }

  const token = authHeader.replace("Bearer ", "");
  const secret = new TextEncoder().encode(env.MOBILE_JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch {
    return apiError(ErrorCode.UNAUTHORIZED, "로그인이 필요합니다", 401);
  }
}
