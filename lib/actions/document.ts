"use server"

import { db } from "@/lib/db"
import { documentSchema } from "@/lib/validation/schemas"
import { revalidatePath } from "next/cache"

export async function createDocument(formData: FormData) {
  const rawFormData = {
    title: formData.get("title"),
    content: formData.get("content"),
    teamId: formData.get("teamId"),
    parentId: formData.get("parentId"),
    authorId: formData.get("authorId"),
  }

  const validatedFields = documentSchema.safeParse({
    title: rawFormData.title,
    content: rawFormData.content ? JSON.parse(rawFormData.content as string) : null,
    teamId: rawFormData.teamId,
    parentId: rawFormData.parentId || undefined,
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, content, teamId, parentId } = validatedFields.data

  try {
    const document = await db.document.create({
      data: {
        title,
        content: content || {},
        teamId,
        parentId: parentId || null,
        authorId: rawFormData.authorId as string,
      },
    })

    revalidatePath(`/dashboard/${teamId}/docs`)
    return { success: true, document }
  } catch (error) {
    return {
      error: { general: ["Failed to create document. Please try again."] },
    }
  }
}

export async function updateDocument(documentId: string, formData: FormData) {
  const rawFormData = {
    title: formData.get("title"),
    content: formData.get("content"),
  }

  try {
    const document = await db.document.update({
      where: { id: documentId },
      data: {
        title: rawFormData.title as string,
        content: rawFormData.content
          ? JSON.parse(rawFormData.content as string)
          : undefined,
      },
    })

    revalidatePath(`/dashboard/${document.teamId}/docs`)
    return { success: true, document }
  } catch (error) {
    return {
      error: { general: ["Failed to update document. Please try again."] },
    }
  }
}

export async function deleteDocument(documentId: string) {
  try {
    const document = await db.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      return { error: { general: ["Document not found"] } }
    }

    await db.document.delete({
      where: { id: documentId },
    })

    revalidatePath(`/dashboard/${document.teamId}/docs`)
    return { success: true }
  } catch (error) {
    return {
      error: { general: ["Failed to delete document. Please try again."] },
    }
  }
}

