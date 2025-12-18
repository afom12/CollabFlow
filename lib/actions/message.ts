"use server"

import { db } from "@/lib/db"
import { getMentionedUserIds } from "@/lib/utils/mentions"
import { notifyMention } from "@/lib/actions/notification"
import { revalidatePath } from "next/cache"

export async function createMessage(teamId: string, content: string, authorId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, message: { id: "demo", content, createdAt: new Date() } }
    }

    // Get team members for mention detection
    const teamMembers = await db.teamMember.findMany({
      where: { teamId },
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

    const users = teamMembers.map((tm) => tm.user)
    const mentionedUserIds = getMentionedUserIds(content, users)

    // Create message
    const message = await db.message.create({
      data: {
        teamId,
        content,
        authorId,
        mentions: mentionedUserIds,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    // Send notifications to mentioned users
    for (const userId of mentionedUserIds) {
      if (userId !== authorId) {
        await notifyMention(
          userId,
          message.author.name || message.author.email,
          "team chat",
          `/dashboard/${teamId}/chat`
        )
      }
    }

    revalidatePath(`/dashboard/${teamId}/chat`)
    return { success: true, message }
  } catch (error) {
    return {
      error: { general: ["Failed to send message."] },
    }
  }
}

export async function getMessages(teamId: string, limit: number = 50) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, messages: [] }
    }

    const messages = await db.message.findMany({
      where: { teamId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return { success: true, messages: messages.reverse() }
  } catch (error) {
    return {
      error: { general: ["Failed to fetch messages."] },
    }
  }
}

