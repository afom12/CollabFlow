import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create PrismaClient if DATABASE_URL is set
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    // Return a mock client that throws helpful errors
    return {
      user: {
        findUnique: () => {
          throw new Error("DATABASE_URL not configured. Please set it in your .env file.")
        },
        create: () => {
          throw new Error("DATABASE_URL not configured. Please set it in your .env file.")
        },
      },
      // Add other models as needed
    } as any
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export const db =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL) {
  globalForPrisma.prisma = db as PrismaClient
}

