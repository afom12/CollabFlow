"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createAttachment(data: {
  name: string
  url: string
  type: string
  size: number
  uploadedBy: string
  documentId?: string
  issueId?: string
  commentId?: string
}) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, attachment: { id: "demo", ...data } }
    }

    const attachment = await db.attachment.create({
      data,
    })

    // Revalidate paths
    if (data.documentId) {
      revalidatePath(`/dashboard/*/docs/${data.documentId}`)
    }
    if (data.issueId) {
      revalidatePath(`/dashboard/*/projects/*/${data.issueId}`)
    }

    return { success: true, attachment }
  } catch (error) {
    return {
      error: { general: ["Failed to upload attachment."] },
    }
  }
}

export async function deleteAttachment(attachmentId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true }
    }

    await db.attachment.delete({
      where: { id: attachmentId },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return {
      error: { general: ["Failed to delete attachment."] },
    }
  }
}

export async function getAttachments(documentId?: string, issueId?: string, commentId?: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, attachments: [] }
    }

    const attachments = await db.attachment.findMany({
      where: {
        ...(documentId ? { documentId } : {}),
        ...(issueId ? { issueId } : {}),
        ...(commentId ? { commentId } : {}),
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, attachments }
  } catch (error) {
    return {
      error: { general: ["Failed to fetch attachments."] },
    }
  }
}

