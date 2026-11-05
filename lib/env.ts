import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  CHORDUS_DEMO_MODE: z.enum(["true", "false"]).optional(),
  VERCEL_ENV: z.string().optional(),
});

function read() {
  return schema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
    CHORDUS_DEMO_MODE: process.env.CHORDUS_DEMO_MODE || undefined,
    VERCEL_ENV: process.env.VERCEL_ENV || undefined,
  });
}

export function supabaseConfig(): { url: string; anonKey: string } | null {
  const env = read();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  return { url: env.NEXT_PUBLIC_SUPABASE_URL, anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY };
}

/**
 * Demo mode lets you click through the app without a Supabase project, by picking
 * one of the four demo users. It is only ever on when ALL of these hold:
 * CHORDUS_DEMO_MODE=true, no Supabase project is configured, and this is not a
 * Vercel production deployment.
 */
export function isDemoMode(): boolean {
  const env = read();
  return (
    env.CHORDUS_DEMO_MODE === "true" && supabaseConfig() === null && env.VERCEL_ENV !== "production"
  );
}
