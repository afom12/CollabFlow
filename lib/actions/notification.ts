"use server"

import { db } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const createNotificationSchema = z.object({
  userId: z.string(),
  type: z.enum(["mention", "comment", "assignment", "invitation", "update", "issue_update"]),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  link: z.string().url().optional(),
})

/**
 * Create a new notification for a user
 */
export async function createNotification(data: {
  userId: string
  type: "mention" | "comment" | "assignment" | "invitation" | "update" | "issue_update"
  title: string
  message: string
  link?: string
}) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, notification: { id: `notif-${Date.now()}`, ...data } }
    }

    const validatedData = createNotificationSchema.parse(data)

    const notification = await db.notification.create({
      data: validatedData,
    })

    // Revalidate notifications page
    revalidatePath("/dashboard")
    revalidatePath(`/notifications`)

    return { success: true, notification }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.flatten().fieldErrors,
      }
    }
    return {
      error: { general: ["Failed to create notification."] },
    }
  }
}

/**
 * Get all notifications for a user
 */
export async function getNotifications(userId: string, limit: number = 50) {
  try {
    if (!process.env.DATABASE_URL) {
      return {
        success: true,
        notifications: [],
        unreadCount: 0,
      }
    }

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    const unreadCount = await db.notification.count({
      where: {
        userId,
        read: false,
      },
    })

    return {
      success: true,
      notifications,
      unreadCount,
    }
  } catch (error) {
    return {
      error: { general: ["Failed to fetch notifications."] },
    }
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string, userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true }
    }

    // Verify the notification belongs to the user
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification || notification.userId !== userId) {
      return {
        error: { general: ["Notification not found or unauthorized."] },
      }
    }

    await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    revalidatePath("/dashboard")
    revalidatePath(`/notifications`)

    return { success: true }
  } catch (error) {
    return {
      error: { general: ["Failed to mark notification as read."] },
    }
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true }
    }

    await db.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    })

    revalidatePath("/dashboard")
    revalidatePath(`/notifications`)

    return { success: true }
  } catch (error) {
    return {
      error: { general: ["Failed to mark all notifications as read."] },
    }
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string, userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true }
    }

    // Verify the notification belongs to the user
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification || notification.userId !== userId) {
      return {
        error: { general: ["Notification not found or unauthorized."] },
      }
    }

    await db.notification.delete({
      where: { id: notificationId },
    })

    revalidatePath("/dashboard")
    revalidatePath(`/notifications`)

    return { success: true }
  } catch (error) {
    return {
      error: { general: ["Failed to delete notification."] },
    }
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: true, count: 0 }
    }

    const count = await db.notification.count({
      where: {
        userId,
        read: false,
      },
    })

    return { success: true, count }
  } catch (error) {
    return {
      error: { general: ["Failed to get unread count."] },
    }
  }
}

/**
 * Helper function to create notification when user is mentioned
 */
export async function notifyMention(userId: string, mentionedBy: string, context: string, link?: string) {
  return createNotification({
    userId,
    type: "mention",
    title: "You were mentioned",
    message: `${mentionedBy} mentioned you in ${context}`,
    link,
  })
}

/**
 * Helper function to create notification when issue is assigned
 */
export async function notifyIssueAssignment(
  userId: string,
  issueTitle: string,
  assignedBy: string,
  link?: string
) {
  return createNotification({
    userId,
    type: "assignment",
    title: "New assignment",
    message: `${assignedBy} assigned you to "${issueTitle}"`,
    link,
  })
}

/**
 * Helper function to create notification when comment is added
 */
export async function notifyComment(userId: string, commenter: string, context: string, link?: string) {
  return createNotification({
    userId,
    type: "comment",
    title: "New comment",
    message: `${commenter} commented on ${context}`,
    link,
  })
}

/**
 * Helper function to create notification for team invitations
 */
export async function notifyTeamInvitation(userId: string, teamName: string, inviter: string, link?: string) {
  return createNotification({
    userId,
    type: "invitation",
    title: "Team invitation",
    message: `${inviter} invited you to join ${teamName}`,
    link,
  })
}

