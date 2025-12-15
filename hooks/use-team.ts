"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTeamMembers, updateTeam, deleteTeam, updateMemberRole, removeTeamMember } from "@/lib/actions/team"
import { useToast } from "@/hooks/use-toast"

export function useTeam(teamId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Mock team data for demo
  const mockTeam = {
    id: teamId,
    name: teamId === "my-team" ? "My Team" : teamId.charAt(0).toUpperCase() + teamId.slice(1),
    description: "A collaborative workspace for your team",
    slug: teamId,
    plan: "free" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const teamQuery = useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      // In real app, fetch from API
      return mockTeam
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const membersQuery = useQuery({
    queryKey: ["team-members", teamId],
    queryFn: async () => {
      const result = await getTeamMembers(teamId)
      if (result.error) {
        // Return mock data if database not available
        return {
          members: [
            {
              id: "1",
              user: {
                id: "1",
                name: "You",
                email: "you@example.com",
                image: null,
              },
              role: "owner" as const,
              joinedAt: new Date(),
            },
          ],
        }
      }
      return result
    },
  })

  const updateTeamMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const formData = new FormData()
      formData.append("teamId", teamId)
      formData.append("name", data.name)
      if (data.description) formData.append("description", data.description)
      return updateTeam(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", teamId] })
      toast({
        title: "Success",
        description: "Team settings updated successfully!",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update team settings.",
        variant: "destructive",
      })
    },
  })

  const deleteTeamMutation = useMutation({
    mutationFn: () => deleteTeam(teamId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Team deleted successfully!",
      })
      window.location.href = "/dashboard"
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete team.",
        variant: "destructive",
      })
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: string }) =>
      updateMemberRole(teamId, userId, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] })
      toast({
        title: "Success",
        description: "Member role updated!",
      })
    },
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => removeTeamMember(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] })
      toast({
        title: "Success",
        description: "Member removed from team!",
      })
    },
  })

  return {
    team: teamQuery.data,
    members: membersQuery.data?.members || [],
    isLoading: teamQuery.isLoading || membersQuery.isLoading,
    updateTeam: updateTeamMutation.mutate,
    deleteTeam: deleteTeamMutation.mutate,
    updateRole: updateRoleMutation.mutate,
    removeMember: removeMemberMutation.mutate,
    isUpdating: updateTeamMutation.isPending,
    isDeleting: deleteTeamMutation.isPending,
  }
}

