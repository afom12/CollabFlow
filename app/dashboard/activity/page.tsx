"use client"

import { ActivityFeed } from "@/components/activity-feed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, TrendingUp, Users } from "lucide-react"

// Mock data - replace with actual data fetching
const mockActivities = [
  {
    id: "1",
    type: "document_created" as const,
    actor: {
      id: "1",
      name: "John Doe",
      avatar: undefined,
    },
    target: {
      id: "1",
      name: "Project Plan",
      type: "document",
    },
    timestamp: new Date("2024-01-16T10:00:00Z"),
  },
  {
    id: "2",
    type: "issue_created" as const,
    actor: {
      id: "2",
      name: "Jane Smith",
      avatar: undefined,
    },
    target: {
      id: "1",
      name: "Fix authentication bug",
      type: "issue",
    },
    timestamp: new Date("2024-01-16T09:30:00Z"),
  },
  {
    id: "3",
    type: "comment_added" as const,
    actor: {
      id: "1",
      name: "John Doe",
      avatar: undefined,
    },
    target: {
      id: "1",
      name: "Project Plan",
      type: "document",
    },
    timestamp: new Date("2024-01-16T08:15:00Z"),
  },
  {
    id: "4",
    type: "member_joined" as const,
    actor: {
      id: "3",
      name: "Bob Johnson",
      avatar: undefined,
    },
    timestamp: new Date("2024-01-15T14:20:00Z"),
  },
]

export default function ActivityPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Activity & Insights</h1>
        <p className="text-muted-foreground">
          Track team activity and collaboration metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              8 in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              All active
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="space-y-4">
          <ActivityFeed activities={mockActivities} />
        </TabsContent>
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Team Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics and insights coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

