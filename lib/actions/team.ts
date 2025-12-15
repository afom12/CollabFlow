"use server"

import { db } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
  userId: z.string(),
})

const updateTeamSchema = z.object({
  teamId: z.string(),
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
})

const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  teamId: z.string(),
  role: z.enum(["owner", "admin", "member", "viewer"]).default("member"),
})

export async function createTeam(formData: FormData) {
  const rawFormData = {
    name: formData.get("name"),
    description: formData.get("description"),
    userId: formData.get("userId"),
  }

  const validatedFields = createTeamSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, userId } = validatedFields.data

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  try {
    if (!process.env.DATABASE_URL) {
      // Return mock data for demo
      return {
        success: true,
        team: {
          id: `team-${Date.now()}`,
          name,
          slug,
          description: description || null,
        },
      }
    }

    const team = await db.team.create({
      data: {
        name,
        description: description || null,
        slug,
        members: {
          create: {
            userId,
            role: "owner",
          },
        },
      },
    })

    revalidatePath("/dashboard")
    return { success: true, team }
  } catch (error) {
    return {
      error: { general: ["Failed to create team. Please try again."] },
    }
  }
}

export async function updateTeam(formData: FormData) {
  const rawFormData = {
    teamId: formData.get("teamId"),
    name: formData.get("name"),
    description: formData.get("description"),
  }

  const validatedFields = updateTeamSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { teamId, name, description } = validatedFields.data

  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, message: "Team updated successfully (demo mode)" }
    }

    await db.team.update({
      where: { id: teamId },
      data: {
        name,
        description: description || null,
      },
    })

    revalidatePath(`/${teamId}/settings`)
    return { success: true, message: "Team updated successfully" }
  } catch (error) {
    return {
      error: { general: ["Failed to update team. Please try again."] },
    }
  }
}

export async function deleteTeam(teamId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, message: "Team deleted successfully (demo mode)" }
    }

    await db.team.delete({
      where: { id: teamId },
    })

    revalidatePath("/dashboard")
    return { success: true, message: "Team deleted successfully" }
  } catch (error) {
    return {
      error: { general: ["Failed to delete team. Please try again."] },
    }
  }
}

export async function getTeamMembers(teamId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      // Return mock data
      return {
        success: true,
        members: [
          {
            id: "1",
            user: {
              id: "1",
              name: "You",
              email: "you@example.com",
              image: null,
            },
            role: "owner",
            joinedAt: new Date(),
          },
        ],
      }
    }

    const members = await db.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    })

    return { success: true, members }
  } catch (error) {
    return {
      error: { general: ["Failed to fetch team members."] },
    }
  }
}

export async function updateMemberRole(teamId: string, userId: string, newRole: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, message: "Role updated (demo mode)" }
    }

    await db.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      data: { role: newRole },
    })

    revalidatePath(`/${teamId}/settings`)
    return { success: true }
  } catch (error) {
    return {
      error: { general: ["Failed to update member role."] },
    }
  }
}

export async function removeTeamMember(teamId: string, userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, message: "Member removed (demo mode)" }
    }

    await db.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    })

    revalidatePath(`/${teamId}/settings`)
    return { success: true }
  } catch (error) {
    return {
      error: { general: ["Failed to remove team member."] },
    }
  }
}

export async function inviteTeamMember(formData: FormData) {
  const rawFormData = {
    email: formData.get("email"),
    teamId: formData.get("teamId"),
    role: formData.get("role"),
  }

  const validatedFields = inviteTeamMemberSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, teamId, role } = validatedFields.data

  try {
    if (!process.env.DATABASE_URL) {
      // Demo mode - return success
      return {
        success: true,
        message: `Invitation sent to ${email} (demo mode)`,
      }
    }

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        error: { email: ["User not found. They need to sign up first."] },
      }
    }

    const existingMember = await db.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    })

    if (existingMember) {
      return {
        error: { email: ["User is already a team member."] },
      }
    }

    await db.teamMember.create({
      data: {
        teamId,
        userId: user.id,
        role,
      },
    })

    revalidatePath(`/${teamId}/settings`)
    return { success: true }
  } catch (error) {
    return {
      error: { general: ["Failed to send invitation. Please try again."] },
    }
  }
}
