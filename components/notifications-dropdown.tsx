"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, CheckCheck, Loader2, MessageSquare, UserPlus, AlertCircle, GitBranch, AtSign } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useNotifications } from "@/hooks/use-notifications"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

const notificationIcons = {
  mention: AtSign,
  comment: MessageSquare,
  assignment: AlertCircle,
  invitation: UserPlus,
  update: GitBranch,
  issue_update: GitBranch,
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const userId = session?.user?.id
  
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications(userId)

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  if (!userId) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-8 text-xs"
              disabled={isLoading}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
              <p className="text-sm">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || Bell
                const content = (
                  <div
                    className={cn(
                      "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                      !notification.read && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "mt-0.5 p-1.5 rounded-md",
                        !notification.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "font-medium text-sm",
                            !notification.read && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                )

                return notification.link ? (
                  <Link
                    key={notification.id}
                    href={notification.link}
                    onClick={() => {
                      if (!notification.read) {
                        handleMarkAsRead(notification.id)
                      }
                      setOpen(false)
                    }}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>{content}</div>
                )
              })}
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Link href="/notifications">
              <Button 
                variant="ghost" 
                className="w-full" 
                size="sm"
                onClick={() => setOpen(false)}
              >
                View all notifications
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

