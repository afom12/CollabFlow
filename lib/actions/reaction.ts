"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function toggleReaction(
  emoji: string,
  userId: string,
  commentId?: string,
  documentId?: string
) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true }
    }

    if (!commentId && !documentId) {
      return {
        error: { general: ["Either commentId or documentId is required"] },
      }
    }

    // Check if reaction already exists
    const existingReaction = await db.reaction.findFirst({
      where: {
        emoji,
        userId,
        ...(commentId ? { commentId } : { documentId }),
      },
    })

    if (existingReaction) {
      // Remove reaction
      await db.reaction.delete({
        where: { id: existingReaction.id },
      })
    } else {
      // Add reaction
      await db.reaction.create({
        data: {
          emoji,
          userId,
          ...(commentId ? { commentId } : { documentId }),
        },
      })
    }

    // Revalidate paths
    if (commentId) {
      revalidatePath("/dashboard")
    }
    if (documentId) {
      revalidatePath(`/dashboard/*/docs/${documentId}`)
    }

    return { success: true }
  } catch (error) {
    return {
      error: { general: ["Failed to toggle reaction."] },
    }
  }
}

export async function getReactions(commentId?: string, documentId?: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, reactions: [] }
    }

    const reactions = await db.reaction.findMany({
      where: {
        ...(commentId ? { commentId } : { documentId }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Group by emoji
    const grouped = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = {
          emoji: reaction.emoji,
          count: 0,
          users: [],
        }
      }
      acc[reaction.emoji].count++
      acc[reaction.emoji].users.push(reaction.user)
      return acc
    }, {} as Record<string, { emoji: string; count: number; users: Array<{ id: string; name: string | null; email: string }> }>)

    return {
      success: true,
      reactions: Object.values(grouped),
    }
  } catch (error) {
    return {
      error: { general: ["Failed to fetch reactions."] },
    }
  }
}

