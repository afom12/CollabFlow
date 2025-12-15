"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateIssueStatus } from "@/lib/actions/issue"
import { CommentsSection } from "@/components/comments-section"
import { ArrowLeft, User, Calendar } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual data fetching
const mockIssue = {
  id: "1",
  title: "Implement user authentication",
  description: "Set up NextAuth.js with email/password and OAuth providers. This should include Google and GitHub OAuth.",
  status: "in_progress",
  priority: "high",
  type: "task",
  assignee: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  },
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-16T14:30:00Z",
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

const statusColors = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  in_review: "bg-purple-100 text-purple-800",
  done: "bg-green-100 text-green-800",
}

export default function IssueDetailPage() {
  const params = useParams()
  const teamId = params.team as string
  const projectId = params.projectId as string
  const issueId = params.issueId as string

  const [issue, setIssue] = useState(mockIssue)
  const [comment, setComment] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await updateIssueStatus(issueId, newStatus, teamId)
      setIssue({ ...issue, status: newStatus })
    } catch (error) {
      console.error("Failed to update status:", error)
    }
    setIsUpdating(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href={`/dashboard/${teamId}/projects/${projectId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to project
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{issue.title}</h1>
          <div className="flex gap-2 mb-4">
            <Badge className={priorityColors[issue.priority as keyof typeof priorityColors]}>
              {issue.priority}
            </Badge>
            <Badge className={statusColors[issue.status as keyof typeof statusColors]}>
              {issue.status.replace("_", " ")}
            </Badge>
            <Badge variant="outline">{issue.type}</Badge>
          </div>
        </div>
        <Select
          value={issue.status}
          onValueChange={handleStatusChange}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {issue.description}
              </p>
            </CardContent>
          </Card>

          <CommentsSection
            issueId={issueId}
            comments={[]}
            currentUserId="current-user-id"
            onCommentAdded={() => {
              // Refresh comments
              window.location.reload()
            }}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assignee</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4" />
                  <span>{issue.assignee?.name || "Unassigned"}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Updated</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(issue.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

