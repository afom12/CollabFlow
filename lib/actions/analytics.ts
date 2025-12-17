"use server"

import { db } from "@/lib/db"

export async function getTeamAnalytics(teamId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return {
        success: true,
        analytics: {
          totalDocuments: 0,
          activeProjects: 0,
          completedIssues: 0,
          teamVelocity: 0,
          documentsThisWeek: 0,
          issuesThisWeek: 0,
          issuesByStatus: {
            todo: 0,
            in_progress: 0,
            in_review: 0,
            done: 0,
          },
          recentActivity: [],
        },
      }
    }

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get total documents
    const totalDocuments = await db.document.count({
      where: { teamId },
    })

    // Get documents created this week
    const documentsThisWeek = await db.document.count({
      where: {
        teamId,
        createdAt: { gte: weekAgo },
      },
    })

    // Get active projects
    const activeProjects = await db.project.count({
      where: {
        teamId,
        status: "active",
      },
    })

    // Get projects in progress (have issues in progress)
    const projectsInProgress = await db.project.findMany({
      where: {
        teamId,
        status: "active",
        issues: {
          some: {
            status: "in_progress",
          },
        },
      },
      select: { id: true },
    })

    // Get completed issues
    const completedIssues = await db.issue.count({
      where: {
        teamId,
        status: "done",
      },
    })

    // Get issues completed this week
    const issuesThisWeek = await db.issue.count({
      where: {
        teamId,
        status: "done",
        updatedAt: { gte: weekAgo },
      },
    })

    // Get issues by status
    const issuesByStatus = {
      todo: await db.issue.count({
        where: { teamId, status: "todo" },
      }),
      in_progress: await db.issue.count({
        where: { teamId, status: "in_progress" },
      }),
      in_review: await db.issue.count({
        where: { teamId, status: "in_review" },
      }),
      done: await db.issue.count({
        where: { teamId, status: "done" },
      }),
    }

    // Calculate team velocity (issues completed this month vs last month)
    const issuesThisMonth = await db.issue.count({
      where: {
        teamId,
        status: "done",
        updatedAt: { gte: monthAgo },
      },
    })

    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    const issuesLastMonth = await db.issue.count({
      where: {
        teamId,
        status: "done",
        updatedAt: {
          gte: twoMonthsAgo,
          lt: monthAgo,
        },
      },
    })

    const teamVelocity = issuesLastMonth > 0
      ? Math.round(((issuesThisMonth - issuesLastMonth) / issuesLastMonth) * 100)
      : issuesThisMonth > 0 ? 100 : 0

    // Get recent activity
    const recentDocuments = await db.document.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    })

    const recentIssues = await db.issue.findMany({
      where: { teamId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    })

    const recentActivity = [
      ...recentDocuments.map((doc) => ({
        type: "document" as const,
        id: doc.id,
        title: doc.title,
        timestamp: doc.createdAt,
        description: "created",
      })),
      ...recentIssues.map((issue) => ({
        type: "issue" as const,
        id: issue.id,
        title: issue.title,
        timestamp: issue.updatedAt,
        description: `status: ${issue.status}`,
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)

    return {
      success: true,
      analytics: {
        totalDocuments,
        activeProjects,
        projectsInProgress: projectsInProgress.length,
        completedIssues,
        teamVelocity,
        documentsThisWeek,
        issuesThisWeek,
        issuesByStatus,
        recentActivity,
      },
    }
  } catch (error) {
    console.error("Analytics error:", error)
    return {
      error: { general: ["Failed to fetch analytics."] },
    }
  }
}

