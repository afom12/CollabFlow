"use server"

import { db } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { getMentionedUserIds } from "@/lib/utils/mentions"
import { notifyMention } from "@/lib/actions/notification"
import { sendCommentEmail, sendMentionEmail } from "@/lib/utils/email"

const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  documentId: z.string().optional(),
  issueId: z.string().optional(),
  authorId: z.string(),
  parentId: z.string().optional(),
  teamId: z.string().optional(),
})

export async function createComment(formData: FormData) {
  const rawFormData = {
    content: formData.get("content"),
    documentId: formData.get("documentId"),
    issueId: formData.get("issueId"),
    authorId: formData.get("authorId") || "current-user-id",
    parentId: formData.get("parentId"),
    teamId: formData.get("teamId"),
  }

  const validatedFields = createCommentSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { content, documentId, issueId, authorId, parentId, teamId } = validatedFields.data

  if (!documentId && !issueId) {
    return {
      error: { general: ["Either documentId or issueId is required"] },
    }
  }

  try {
    if (!process.env.DATABASE_URL) {
      return {
        success: true,
        comment: {
          id: "demo",
          content,
          authorId,
          createdAt: new Date(),
        },
      }
    }

    // Get team members for mention detection
    let users: Array<{ id: string; name: string | null; email: string }> = []
    if (teamId) {
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
      users = teamMembers.map((tm) => tm.user)
    }

    // Extract mentions
    const mentionedUserIds = getMentionedUserIds(content, users)

    // Get author info
    const author = await db.user.findUnique({
      where: { id: authorId },
      select: { id: true, name: true, email: true },
    })

    // Create comment
    const comment = await db.comment.create({
      data: {
        content,
        documentId: documentId || null,
        issueId: issueId || null,
        authorId,
        parentId: parentId || null,
        mentions: mentionedUserIds,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Send notifications and emails to mentioned users
    const context = documentId ? "a document" : "an issue"
    const link = documentId
      ? `/dashboard/${teamId}/docs/${documentId}`
      : `/dashboard/${teamId}/projects/${issueId}`

    for (const userId of mentionedUserIds) {
      if (userId !== authorId) {
        // Create notification
        await notifyMention(
          userId,
          author?.name || author?.email || "Someone",
          context,
          link
        )

        // Send email if user exists
        const mentionedUser = await db.user.findUnique({
          where: { id: userId },
          select: { email: true },
        })

        if (mentionedUser?.email) {
          await sendMentionEmail(
            mentionedUser.email,
            author?.name || author?.email || "Someone",
            context,
            `${process.env.NEXTAUTH_URL || "http://localhost:3000"}${link}`
          )
        }
      }
    }

    // Send comment notification emails to relevant users
    if (documentId) {
      const document = await db.document.findUnique({
        where: { id: documentId },
        include: {
          author: { select: { email: true } },
        },
      })

      if (document && document.author.email && document.authorId !== authorId) {
        await sendCommentEmail(
          document.author.email,
          author?.name || author?.email || "Someone",
          document.title,
          content.substring(0, 100),
          `${process.env.NEXTAUTH_URL || "http://localhost:3000"}${link}`
        )
      }
    }

    if (documentId) {
      revalidatePath(`/dashboard/${teamId}/docs/${documentId}`)
    }
    if (issueId) {
      revalidatePath(`/dashboard/${teamId}/projects/*/${issueId}`)
    }

    return { success: true, comment }
  } catch (error) {
    console.error("Comment creation error:", error)
    return {
      error: { general: ["Failed to create comment. Please try again."] },
    }
  }
}

