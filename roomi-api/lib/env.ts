import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  KAKAO_CLIENT_ID: z.string().min(1),
  KAKAO_CLIENT_SECRET: z.string().min(1),
  NAVER_CLIENT_ID: z.string().min(1),
  NAVER_CLIENT_SECRET: z.string().min(1),
});

const _env = EnvSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ 환경변수 검증 실패:");
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
