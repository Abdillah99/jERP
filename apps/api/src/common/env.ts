import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string(),
  OIDC_JWKS_URI: z.string().optional(),
  JWT_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
