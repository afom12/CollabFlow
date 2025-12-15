"use client"

import { ActivityFeed } from "@/components/activity-feed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, GitBranch, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
]

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/activity">View All Activity</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              5 active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              All active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground mt-1">
              vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed activities={mockActivities} maxItems={10} />
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/team/docs">
                <FileText className="h-4 w-4 mr-2" />
                Create Document
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/team/projects">
                <GitBranch className="h-4 w-4 mr-2" />
                Create Project
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/team/settings">
                <Users className="h-4 w-4 mr-2" />
                Invite Team Member
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

