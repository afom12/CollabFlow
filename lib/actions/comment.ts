"use server"

import { db } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  documentId: z.string().optional(),
  issueId: z.string().optional(),
  authorId: z.string(),
  parentId: z.string().optional(),
})

export async function createComment(formData: FormData) {
  const rawFormData = {
    content: formData.get("content"),
    documentId: formData.get("documentId"),
    issueId: formData.get("issueId"),
    authorId: formData.get("authorId") || "current-user-id", // TODO: Get from session
    parentId: formData.get("parentId"),
  }

  const validatedFields = createCommentSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { content, documentId, issueId, authorId, parentId } = validatedFields.data

  if (!documentId && !issueId) {
    return {
      error: { general: ["Either documentId or issueId is required"] },
    }
  }

  try {
    const comment = await db.comment.create({
      data: {
        content,
        documentId: documentId || null,
        issueId: issueId || null,
        authorId,
        parentId: parentId || null,
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

    if (documentId) {
      revalidatePath(`/dashboard/*/docs/${documentId}`)
    }
    if (issueId) {
      revalidatePath(`/dashboard/*/projects/*/${issueId}`)
    }

    return { success: true, comment }
  } catch (error) {
    return {
      error: { general: ["Failed to create comment. Please try again."] },
    }
  }
}

