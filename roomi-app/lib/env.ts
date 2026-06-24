import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_ANDROID_CLIENT_ID: z.string().min(1),
});

const env = envSchema.parse({
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
});

export default env;
