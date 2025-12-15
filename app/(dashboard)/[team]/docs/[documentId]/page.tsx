"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { CollaborativeEditor } from "@/components/collaborative-editor"
import { DocumentVersionHistory } from "@/components/document-version-history"
import { CommentsSection } from "@/components/comments-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Save, History } from "lucide-react"
import { updateDocument } from "@/lib/actions/document"
import { useToast } from "@/hooks/use-toast"

// Mock data - replace with actual data fetching
const mockDocument = {
  id: "1",
  title: "Getting Started Guide",
  content: {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Welcome to CollabFlow" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This is a collaborative document. Start editing to see real-time collaboration in action!",
          },
        ],
      },
    ],
  },
  versions: [
    {
      id: "1",
      version: 1,
      content: {},
      createdAt: new Date("2024-01-15"),
      createdBy: {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
      },
    },
  ],
}

export default function DocumentPage() {
  const params = useParams()
  const documentId = params.documentId as string
  const [document, setDocument] = useState(mockDocument)
  const [isSaving, setIsSaving] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const { toast } = useToast()

  const handleSave = async (content: any) => {
    setIsSaving(true)
    const formData = new FormData()
    formData.append("title", document.title)
    formData.append("content", JSON.stringify(content))

    try {
      const result = await updateDocument(documentId, formData)
      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to save document.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Saved",
          description: "Document saved successfully!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save document.",
        variant: "destructive",
      })
    }
    setIsSaving(false)
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{document.title}</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
              {isSaving && (
                <Button variant="outline" disabled>
                  Saving...
                </Button>
              )}
            </div>
          </div>
          <CollaborativeEditor
            documentId={documentId}
            initialContent={document.content}
            onSave={handleSave}
          />
          
          <div className="mt-8">
            <CommentsSection
              documentId={documentId}
              comments={[]}
              currentUserId="current-user-id"
              onCommentAdded={() => {
                // Refresh comments
                window.location.reload()
              }}
            />
          </div>
        </div>
      </div>
      {showHistory && (
        <div className="w-80 border-l p-6 overflow-auto">
          <DocumentVersionHistory
            versions={document.versions}
            currentVersion={1}
            onRestore={(versionId) => {
              toast({
                title: "Restored",
                description: "Document version restored.",
              })
            }}
          />
        </div>
      )}
    </div>
  )
}

