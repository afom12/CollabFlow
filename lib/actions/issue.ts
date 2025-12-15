"use server"

import { db } from "@/lib/db"
import { issueSchema } from "@/lib/validation/schemas"
import { revalidatePath } from "next/cache"

export async function createIssue(formData: FormData) {
  const rawFormData = {
    title: formData.get("title"),
    description: formData.get("description"),
    projectId: formData.get("projectId"),
    teamId: formData.get("teamId"),
    assigneeId: formData.get("assigneeId"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    type: formData.get("type"),
  }

  const validatedFields = issueSchema.safeParse({
    title: rawFormData.title,
    description: rawFormData.description,
    projectId: rawFormData.projectId,
    teamId: rawFormData.teamId,
    assigneeId: rawFormData.assigneeId || undefined,
    status: rawFormData.status || "todo",
    priority: rawFormData.priority || "medium",
    type: rawFormData.type || "task",
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const data = validatedFields.data

  try {
    const issue = await db.issue.create({
      data: {
        title: data.title,
        description: data.description || null,
        projectId: data.projectId,
        teamId: data.teamId,
        assigneeId: data.assigneeId || null,
        status: data.status,
        priority: data.priority,
        type: data.type,
      },
    })

    revalidatePath(`/dashboard/${data.teamId}/projects`)
    return { success: true, issue }
  } catch (error) {
    return {
      error: { general: ["Failed to create issue. Please try again."] },
    }
  }
}

export async function updateIssueStatus(
  issueId: string,
  newStatus: string,
  teamId: string
) {
  try {
    await db.issue.update({
      where: { id: issueId },
      data: { status: newStatus as any },
    })

    revalidatePath(`/dashboard/${teamId}/projects`)
    return { success: true }
  } catch (error) {
    return {
      error: { general: ["Failed to update issue. Please try again."] },
    }
  }
}

