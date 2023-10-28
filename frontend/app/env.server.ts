import { z } from "zod";

const envSchema = z.object({
  SESSION_SECRET: z.string(),
  quack: z.string(),
});

export const ENV = envSchema.parse(Bun.env);
