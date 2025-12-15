"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { FileText, GitBranch, MessageSquare, UserPlus, CheckCircle2 } from "lucide-react"

type Activity = {
  id: string
  type: "document_created" | "document_updated" | "issue_created" | "issue_updated" | "comment_added" | "member_joined" | "project_created"
  actor: {
    id: string
    name: string
    avatar?: string
  }
  target?: {
    id: string
    name: string
    type: string
  }
  timestamp: Date
  metadata?: Record<string, any>
}

type ActivityFeedProps = {
  activities: Activity[]
  maxItems?: number
}

const activityIcons = {
  document_created: FileText,
  document_updated: FileText,
  issue_created: GitBranch,
  issue_updated: GitBranch,
  comment_added: MessageSquare,
  member_joined: UserPlus,
  project_created: CheckCircle2,
}

const activityMessages = {
  document_created: (actor: string, target?: string) => `${actor} created document "${target}"`,
  document_updated: (actor: string, target?: string) => `${actor} updated document "${target}"`,
  issue_created: (actor: string, target?: string) => `${actor} created issue "${target}"`,
  issue_updated: (actor: string, target?: string) => `${actor} updated issue "${target}"`,
  comment_added: (actor: string, target?: string) => `${actor} commented on "${target}"`,
  member_joined: (actor: string) => `${actor} joined the team`,
  project_created: (actor: string, target?: string) => `${actor} created project "${target}"`,
}

export function ActivityFeed({ activities, maxItems = 20 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        {displayActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((activity) => {
              const Icon = activityIcons[activity.type]
              const message = activityMessages[activity.type](
                activity.actor.name,
                activity.target?.name
              )

              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.actor.avatar} />
                    <AvatarFallback>
                      {activity.actor.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">
                        <span className="font-medium">{activity.actor.name}</span>{" "}
                        <span className="text-muted-foreground">{message}</span>
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

