"use client"

import { KanbanBoard } from "@/components/kanban-board"
import { IssueCreateModal } from "@/components/issue-create-modal"
import { useState } from "react"
import { updateIssueStatus } from "@/lib/actions/issue"
import { useParams } from "next/navigation"

// Mock data - replace with actual data fetching
const mockIssues = [
  {
    id: "1",
    title: "Implement user authentication",
    description: "Set up NextAuth.js with email/password and OAuth providers",
    status: "todo" as const,
    priority: "high" as const,
  },
  {
    id: "2",
    title: "Create document editor",
    description: "Integrate TipTap with real-time collaboration",
    status: "in_progress" as const,
    priority: "urgent" as const,
  },
  {
    id: "3",
    title: "Build Kanban board",
    description: "Create drag-and-drop Kanban board for issue tracking",
    status: "done" as const,
    priority: "medium" as const,
  },
]

export default function ProjectPage() {
  const params = useParams()
  const teamId = params.team as string
  const [issues, setIssues] = useState(mockIssues)

  const handleIssueUpdate = async (issueId: string, newStatus: string) => {
    // Optimistic update
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus as any } : issue
      )
    )

    // Server update
    try {
      await updateIssueStatus(issueId, newStatus, teamId)
    } catch (error) {
      // Revert on error
      setIssues(mockIssues)
      console.error("Failed to update issue:", error)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Project Name</h1>
          <p className="text-muted-foreground">
            Manage your project issues with the Kanban board
          </p>
        </div>
        <IssueCreateModal
          projectId={projectId}
          teamId={teamId}
          onIssueCreated={() => {
            // Refresh issues - in real app, fetch from server
            window.location.reload()
          }}
        />
      </div>
      <KanbanBoard 
        issues={issues} 
        onIssueUpdate={handleIssueUpdate}
        teamId={teamId}
        projectId={projectId}
      />
    </div>
  )
}

