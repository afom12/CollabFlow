"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

type Issue = {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "in_review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
}

type KanbanBoardProps = {
  issues: Issue[]
  onIssueUpdate?: (issueId: string, newStatus: string) => void
  teamId?: string
  projectId?: string
}

const columns = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "in_review", title: "In Review" },
  { id: "done", title: "Done" },
]

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export function KanbanBoard({ issues, onIssueUpdate, teamId, projectId }: KanbanBoardProps) {
  const [draggedIssue, setDraggedIssue] = useState<string | null>(null)

  const handleDragStart = (issueId: string) => {
    setDraggedIssue(issueId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    if (draggedIssue && onIssueUpdate) {
      onIssueUpdate(draggedIssue, status)
    }
    setDraggedIssue(null)
  }

  const getIssuesByStatus = (status: string) => {
    return issues.filter((issue) => issue.status === status)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnIssues = getIssuesByStatus(column.id)
        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">
                    {column.title}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {columnIssues.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 min-h-[400px]">
                {columnIssues.map((issue) => {
                  const IssueContent = (
                    <div
                      draggable
                      onDragStart={() => handleDragStart(issue.id)}
                      className="p-3 bg-background border rounded-lg cursor-move hover:shadow-md transition-shadow"
                    >
                    <h4 className="font-medium text-sm mb-1">{issue.title}</h4>
                    {issue.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {issue.description}
                      </p>
                    )}
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        priorityColors[issue.priority]
                      }`}
                    >
                      {issue.priority}
                    </span>
                    </div>
                  )

                  return teamId && projectId ? (
                    <Link
                      key={issue.id}
                      href={`/dashboard/${teamId}/projects/${projectId}/${issue.id}`}
                    >
                      {IssueContent}
                    </Link>
                  ) : (
                    <div key={issue.id}>{IssueContent}</div>
                  )
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add issue
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}

