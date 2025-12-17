"use server"

import { db } from "@/lib/db"

export type SearchResult = {
  type: "document" | "project" | "issue"
  id: string
  title: string
  description?: string
  teamId: string
  url: string
  updatedAt: Date
}

export async function search(query: string, teamId: string, userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, results: [] }
    }

    if (!query || query.trim().length < 2) {
      return { success: true, results: [] }
    }

    const searchTerm = `%${query.trim()}%`

    // Search documents
    const documents = await db.document.findMany({
      where: {
        teamId,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          // Note: JSON search is limited in Prisma, so we search by title primarily
        ],
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        teamId: true,
      },
      take: 10,
    })

    // Search projects
    const projects = await db.project.findMany({
      where: {
        teamId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        updatedAt: true,
        teamId: true,
      },
      take: 10,
    })

    // Search issues
    const issues = await db.issue.findMany({
      where: {
        teamId,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        updatedAt: true,
        projectId: true,
        teamId: true,
      },
      take: 10,
    })

    // Get project names for issues
    const projectIds = [...new Set(issues.map((i) => i.projectId))]
    const projectMap = new Map()
    if (projectIds.length > 0) {
      const projectsForIssues = await db.project.findMany({
        where: { id: { in: projectIds } },
        select: { id: true, name: true },
      })
      projectsForIssues.forEach((p) => projectMap.set(p.id, p.name))
    }

    // Format results
    const results: SearchResult[] = [
      ...documents.map((doc) => ({
        type: "document" as const,
        id: doc.id,
        title: doc.title,
        teamId: doc.teamId,
        url: `/${doc.teamId}/docs/${doc.id}`,
        updatedAt: doc.updatedAt,
      })),
      ...projects.map((project) => ({
        type: "project" as const,
        id: project.id,
        title: project.name,
        description: project.description || undefined,
        teamId: project.teamId,
        url: `/${project.teamId}/projects/${project.id}`,
        updatedAt: project.updatedAt,
      })),
      ...issues.map((issue) => ({
        type: "issue" as const,
        id: issue.id,
        title: issue.title,
        description: issue.description || undefined,
        teamId: issue.teamId,
        url: `/${issue.teamId}/projects/${issue.projectId}/${issue.id}`,
        updatedAt: issue.updatedAt,
      })),
    ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

    return { success: true, results }
  } catch (error) {
    console.error("Search error:", error)
    return {
      error: { general: ["Failed to perform search."] },
    }
  }
}

