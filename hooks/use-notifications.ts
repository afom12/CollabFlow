"use client"

import { useState, useEffect, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
} from "@/lib/actions/notification"
import { useToast } from "@/hooks/use-toast"

type Notification = {
  id: string
  type: "mention" | "comment" | "assignment" | "invitation" | "update" | "issue_update"
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: Date
}

export function useNotifications(userId: string | undefined) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) return { notifications: [], unreadCount: 0 }
      const result = await getNotifications(userId)
      if (result.error) {
        throw new Error("Failed to fetch notifications")
      }
      return result
    },
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time feel
  })

  // Fetch unread count separately for quick updates
  const { data: unreadData } = useQuery({
    queryKey: ["notifications", "unread", userId],
    queryFn: async () => {
      if (!userId) return { count: 0 }
      const result = await getUnreadNotificationCount(userId)
      if (result.error) {
        return { count: 0 }
      }
      return result
    },
    enabled: !!userId,
    refetchInterval: 10000, // Check unread count more frequently
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!userId) throw new Error("User not authenticated")
      const result = await markNotificationAsRead(notificationId, userId)
      if (result.error) {
        throw new Error("Failed to mark notification as read")
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] })
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread", userId] })
    },
  })

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated")
      const result = await markAllNotificationsAsRead(userId)
      if (result.error) {
        throw new Error("Failed to mark all notifications as read")
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] })
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread", userId] })
      toast({
        title: "All notifications marked as read",
      })
    },
  })

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!userId) throw new Error("User not authenticated")
      const result = await deleteNotification(notificationId, userId)
      if (result.error) {
        throw new Error("Failed to delete notification")
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] })
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread", userId] })
    },
  })

  const markAsRead = useCallback(
    (notificationId: string) => {
      markAsReadMutation.mutate(notificationId)
    },
    [markAsReadMutation]
  )

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate()
  }, [markAllAsReadMutation])

  const deleteNotif = useCallback(
    (notificationId: string) => {
      deleteNotificationMutation.mutate(notificationId)
    },
    [deleteNotificationMutation]
  )

  return {
    notifications: (notificationsData?.notifications || []) as Notification[],
    unreadCount: unreadData?.count || 0,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotif,
    refetch,
  }
}

