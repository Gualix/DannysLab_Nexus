import { z } from "zod";

/**
 * Environment validation schema
 * Validates all required environment variables at startup
 */
const envSchema = z.object({
  // Supabase Configuration
  VITE_SUPABASE_URL: z.string().url("VITE_SUPABASE_URL must be a valid URL"),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, "VITE_SUPABASE_PUBLISHABLE_KEY is required"),
  
  // Server-only variables (not prefixed with VITE)
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL").optional(),
  SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // Application environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  
  // Server configuration
  PORT: z.number().default(3000).catch(3000),
  HOST: z.string().default("0.0.0.0"),
  
  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  DEBUG: z.string().default("false").transform(v => v === "true"),
});

type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

/**
 * Parse and validate environment variables
 * Throws error if validation fails
 */
export function getEnv(): Env {
  if (validatedEnv) return validatedEnv;

  try {
    // On client side, use import.meta.env
    // On server side, use process.env
    const envVars = typeof window === "undefined" ? process.env : {};
    
    validatedEnv = envSchema.parse({
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || envVars.VITE_SUPABASE_URL,
      VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || envVars.VITE_SUPABASE_PUBLISHABLE_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL || envVars.SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || envVars.SUPABASE_PUBLISHABLE_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY,
      NODE_ENV: process.env.NODE_ENV || envVars.NODE_ENV,
      PORT: parseInt(process.env.PORT || envVars.PORT || "3000"),
      HOST: process.env.HOST || envVars.HOST,
      LOG_LEVEL: process.env.LOG_LEVEL || envVars.LOG_LEVEL,
      DEBUG: process.env.DEBUG || envVars.DEBUG,
    });

    return validatedEnv;
  } catch (error) {
    const message = error instanceof z.ZodError
      ? error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join("\n")
      : "Unknown validation error";
    
    console.error("Environment validation failed:\n", message);
    throw new Error(`Environment configuration invalid:\n${message}`);
  }
}

/**
 * Client-side env getter (safe, only public variables)
 */
export function getPublicEnv() {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    environment: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  };
}

/**
 * Server-side env getter (only use in .server.ts files)
 */
export function getServerEnv() {
  const env = getEnv();
  
  return {
    supabaseUrl: env.SUPABASE_URL,
    supabasePublicKey: env.SUPABASE_PUBLISHABLE_KEY,
    supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    host: env.HOST,
    logLevel: env.LOG_LEVEL,
    debug: env.DEBUG,
  };
}
