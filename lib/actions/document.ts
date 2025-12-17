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
    userId: formData.get("userId"),
  }

  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, document: { id: documentId, teamId: "demo" } }
    }

    // Get current document to check version
    const currentDoc = await db.document.findUnique({
      where: { id: documentId },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    })

    if (!currentDoc) {
      return { error: { general: ["Document not found"] } }
    }

    const newContent = rawFormData.content
      ? JSON.parse(rawFormData.content as string)
      : undefined

    // Create new version before updating
    const nextVersion = currentDoc.versions.length > 0 
      ? currentDoc.versions[0].version + 1 
      : 1

    // Create version snapshot
    await db.documentVersion.create({
      data: {
        documentId,
        content: currentDoc.content || {},
        version: currentDoc.versions.length > 0 ? currentDoc.versions[0].version : 1,
        createdBy: rawFormData.userId as string || currentDoc.authorId,
      },
    })

    // Update document with new content
    const document = await db.document.update({
      where: { id: documentId },
      data: {
        title: rawFormData.title as string,
        content: newContent,
      },
    })

    revalidatePath(`/dashboard/${document.teamId}/docs`)
    revalidatePath(`/dashboard/${document.teamId}/docs/${documentId}`)
    return { success: true, document }
  } catch (error) {
    return {
      error: { general: ["Failed to update document. Please try again."] },
    }
  }
}

export async function getDocumentVersions(documentId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, versions: [] }
    }

    const versions = await db.documentVersion.findMany({
      where: { documentId },
      orderBy: { version: "desc" },
      include: {
        document: {
          select: {
            content: true,
          },
        },
      },
    })

    // Get user info for each version creator
    const versionsWithUsers = await Promise.all(
      versions.map(async (version) => {
        const user = await db.user.findUnique({
          where: { id: version.createdBy },
          select: {
            id: true,
            name: true,
            email: true,
          },
        })

        return {
          id: version.id,
          version: version.version,
          content: version.content,
          createdAt: version.createdAt,
          createdBy: user || {
            id: version.createdBy,
            name: "Unknown",
            email: "",
          },
        }
      })
    )

    return { success: true, versions: versionsWithUsers }
  } catch (error) {
    return {
      error: { general: ["Failed to fetch document versions."] },
    }
  }
}

export async function restoreDocumentVersion(documentId: string, versionId: string, userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true }
    }

    const version = await db.documentVersion.findUnique({
      where: { id: versionId },
    })

    if (!version || version.documentId !== documentId) {
      return { error: { general: ["Version not found"] } }
    }

    // Get current document to create new version from current state
    const currentDoc = await db.document.findUnique({
      where: { id: documentId },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    })

    if (currentDoc) {
      // Save current state as version before restoring
      await db.documentVersion.create({
        data: {
          documentId,
          content: currentDoc.content || {},
          version: currentDoc.versions.length > 0 ? currentDoc.versions[0].version + 1 : 1,
          createdBy: userId,
        },
      })
    }

    // Restore the version
    await db.document.update({
      where: { id: documentId },
      data: {
        content: version.content,
      },
    })

    revalidatePath(`/dashboard/${currentDoc?.teamId}/docs/${documentId}`)
    return { success: true }
  } catch (error) {
    return {
      error: { general: ["Failed to restore version."] },
    }
  }
}

export async function getDocument(documentId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return {
        success: true,
        document: {
          id: documentId,
          title: "Sample Document",
          content: { type: "doc", content: [] },
          teamId: "demo",
        },
      }
    }

    const document = await db.document.findUnique({
      where: { id: documentId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!document) {
      return { error: { general: ["Document not found"] } }
    }

    return { success: true, document }
  } catch (error) {
    return {
      error: { general: ["Failed to fetch document."] },
    }
  }
}

export async function deleteDocument(documentId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true }
    }

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

