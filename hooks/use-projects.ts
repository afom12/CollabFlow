"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createIssue, updateIssueStatus } from "@/lib/actions/issue"
import { useToast } from "@/hooks/use-toast"

export function useProjects(teamId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const projectsQuery = useQuery({
    queryKey: ["projects", teamId],
    queryFn: async () => {
      // Mock data for demo
      return {
        projects: [
          {
            id: "proj-1",
            name: "Website Redesign",
            description: "Complete redesign of company website",
            status: "active" as const,
            issueCount: 12,
            memberCount: 5,
            updatedAt: new Date(),
          },
          {
            id: "proj-2",
            name: "Mobile App",
            description: "New mobile application development",
            status: "active" as const,
            issueCount: 8,
            memberCount: 3,
            updatedAt: new Date(),
          },
        ],
      }
    },
  })

  const issuesQuery = useQuery({
    queryKey: ["issues", teamId],
    queryFn: async () => {
      // Mock issues for demo
      return {
        issues: [
          {
            id: "issue-1",
            title: "Implement user authentication",
            description: "Set up NextAuth.js with email/password and OAuth providers",
            status: "todo" as const,
            priority: "high" as const,
            type: "task" as const,
            projectId: "proj-1",
          },
          {
            id: "issue-2",
            title: "Create document editor",
            description: "Integrate TipTap with real-time collaboration",
            status: "in_progress" as const,
            priority: "urgent" as const,
            type: "feature" as const,
            projectId: "proj-1",
          },
          {
            id: "issue-3",
            title: "Build Kanban board",
            description: "Create drag-and-drop Kanban board for issue tracking",
            status: "done" as const,
            priority: "medium" as const,
            type: "task" as const,
            projectId: "proj-1",
          },
        ],
      }
    },
  })

  const createIssueMutation = useMutation({
    mutationFn: async (data: {
      title: string
      description?: string
      projectId: string
      type?: string
      priority?: string
      status?: string
    }) => {
      const formData = new FormData()
      formData.append("title", data.title)
      if (data.description) formData.append("description", data.description)
      formData.append("projectId", data.projectId)
      formData.append("teamId", teamId)
      if (data.type) formData.append("type", data.type)
      if (data.priority) formData.append("priority", data.priority)
      if (data.status) formData.append("status", data.status)
      return createIssue(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", teamId] })
      toast({
        title: "Success",
        description: "Issue created successfully!",
      })
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ issueId, newStatus }: { issueId: string; newStatus: string }) => {
      return updateIssueStatus(issueId, newStatus, teamId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", teamId] })
    },
  })

  return {
    projects: projectsQuery.data?.projects || [],
    issues: issuesQuery.data?.issues || [],
    isLoading: projectsQuery.isLoading || issuesQuery.isLoading,
    createIssue: createIssueMutation.mutate,
    updateIssueStatus: updateStatusMutation.mutate,
    isCreating: createIssueMutation.isPending,
  }
}

