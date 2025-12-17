/**
 * Environment variable validation and management utilities
 * Ensures all required environment variables are present and valid
 */

import { z } from "zod"

// Define the schema for environment variables
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  
  // Optional OAuth providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  
  // Optional services
  LIVEBLOCKS_SECRET_KEY: z.string().optional(),
  LIVEBLOCKS_PUBLIC_KEY: z.string().optional(),
  UPLOADTHING_SECRET: z.string().optional(),
  UPLOADTHING_APP_ID: z.string().optional(),
  
  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

type Env = z.infer<typeof envSchema>

/**
 * Validates and returns environment variables
 * Throws an error if required variables are missing or invalid
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      LIVEBLOCKS_SECRET_KEY: process.env.LIVEBLOCKS_SECRET_KEY,
      LIVEBLOCKS_PUBLIC_KEY: process.env.LIVEBLOCKS_PUBLIC_KEY,
      UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
      UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
      NODE_ENV: process.env.NODE_ENV || "development",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join(".")).join(", ")
      throw new Error(
        `❌ Invalid or missing environment variables:\n${missingVars}\n\n` +
        `Please check your .env file and ensure all required variables are set.\n` +
        `See .env.example for reference.`
      )
    }
    throw error
  }
}

/**
 * Get validated environment variables
 * Use this function to access environment variables throughout the app
 */
export function getEnv(): Env {
  // In development, validate on every call to catch issues early
  // In production, validate once and cache
  if (process.env.NODE_ENV === "development") {
    return validateEnv()
  }
  
  // Cache validated env in production
  if (!globalThis.validatedEnv) {
    globalThis.validatedEnv = validateEnv()
  }
  
  return globalThis.validatedEnv
}

/**
 * Check if a specific environment variable is set
 */
export function hasEnvVar(key: keyof Env): boolean {
  return !!process.env[key]
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: keyof Env, fallback?: string): string {
  return process.env[key] || fallback || ""
}

// Type augmentation for global cache
declare global {
  var validatedEnv: Env | undefined
}

