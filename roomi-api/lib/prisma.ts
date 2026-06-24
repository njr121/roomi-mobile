import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["info", "warn", "error"], // 필요에 따라 로그 설정
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
