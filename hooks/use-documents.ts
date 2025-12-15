"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createDocument, updateDocument, deleteDocument } from "@/lib/actions/document"
import { useToast } from "@/hooks/use-toast"

export function useDocuments(teamId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const documentsQuery = useQuery({
    queryKey: ["documents", teamId],
    queryFn: async () => {
      // Mock data for demo
      return {
        documents: [
          {
            id: "doc-1",
            title: "Getting Started Guide",
            content: {},
            author: { name: "You", email: "you@example.com" },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "doc-2",
            title: "Project Roadmap",
            content: {},
            author: { name: "You", email: "you@example.com" },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      }
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; content?: any; templateId?: string }) => {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("teamId", teamId)
      formData.append("authorId", "current-user-id")
      if (data.content) {
        formData.append("content", JSON.stringify(data.content))
      }
      const result = await createDocument(formData)
      
      // If database not available, return mock data
      if (!process.env.DATABASE_URL && result.error) {
        return {
          success: true,
          document: {
            id: `doc-${Date.now()}`,
            title: data.title,
            content: data.content || {},
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }
      }
      
      return result
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create document.",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ documentId, title, content }: { documentId: string; title: string; content: any }) => {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", JSON.stringify(content))
      return updateDocument(documentId, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", teamId] })
      toast({
        title: "Saved",
        description: "Document saved successfully!",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", teamId] })
      toast({
        title: "Deleted",
        description: "Document deleted successfully!",
      })
    },
  })

  return {
    documents: documentsQuery.data?.documents || [],
    isLoading: documentsQuery.isLoading,
    createDocument: (data: { title: string; content?: any; templateId?: string }, options?: any) => {
      createMutation.mutate(data, {
        ...options,
        onSuccess: (result) => {
          queryClient.invalidateQueries({ queryKey: ["documents", teamId] })
          toast({
            title: "Success",
            description: "Document created successfully!",
          })
          if (options?.onSuccess) {
            options.onSuccess(result)
          }
        },
      })
    },
    updateDocument: updateMutation.mutate,
    deleteDocument: deleteMutation.mutate,
    isCreating: createMutation.isPending,
  }
}

