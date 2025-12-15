"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function signUp(formData: FormData) {
  const rawFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const validatedFields = signUpSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  // Check if database is configured
  if (!process.env.DATABASE_URL) {
    return {
      error: { 
        general: ["Database not configured. Please set DATABASE_URL in your .env file."] 
      },
    }
  }

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        error: { email: ["User with this email already exists"] },
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { success: true, userId: user.id }
  } catch (error: any) {
    // Handle Prisma errors gracefully
    if (error.code === "P1001" || error.message?.includes("DATABASE_URL")) {
      return {
        error: { 
          general: ["Database connection failed. Please check your DATABASE_URL."] 
        },
      }
    }
    
    return {
      error: { general: ["Failed to create account. Please try again."] },
    }
  }
}

