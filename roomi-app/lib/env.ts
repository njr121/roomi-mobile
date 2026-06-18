import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().url(),
});

const env = envSchema.parse({
  API_URL: process.env.EXPO_PUBLIC_API_URL,
});

export default env;
