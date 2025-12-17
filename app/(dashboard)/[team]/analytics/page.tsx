"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, FileText, GitBranch, Users, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { getTeamAnalytics } from "@/lib/actions/analytics"
import { formatDistanceToNow } from "date-fns"
import { useSession } from "next-auth/react"

export default function AnalyticsPage() {
  const params = useParams()
  const teamId = params.team as string
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      if (!teamId) return
      
      setIsLoading(true)
      const result = await getTeamAnalytics(teamId)
      if (result.success && result.analytics) {
        setAnalytics(result.analytics)
      }
      setIsLoading(false)
    }

    fetchAnalytics()
  }, [teamId])

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Failed to load analytics</p>
      </div>
    )
  }
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Track your team's productivity and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDocuments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{analytics.documentsThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.projectsInProgress} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Issues</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completedIssues}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{analytics.issuesThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${analytics.teamVelocity >= 0 ? "text-green-600" : "text-red-600"}`}>
              {analytics.teamVelocity >= 0 ? "+" : ""}{analytics.teamVelocity}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              ) : (
                analytics.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                  <div key={`${activity.type}-${activity.id}-${index}`} className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.type === "document" ? "bg-blue-500" : "bg-green-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">To Do</span>
                </div>
                <span className="font-semibold">{analytics.issuesByStatus.todo}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">In Progress</span>
                </div>
                <span className="font-semibold">{analytics.issuesByStatus.in_progress}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">In Review</span>
                </div>
                <span className="font-semibold">{analytics.issuesByStatus.in_review}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Done</span>
                </div>
                <span className="font-semibold">{analytics.issuesByStatus.done}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

