"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { CollaborativeEditor } from "@/components/collaborative-editor"
import { DocumentVersionHistory } from "@/components/document-version-history"
import { CommentsSectionEnhanced } from "@/components/comments-section-enhanced"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Save, History, Loader2 } from "lucide-react"
import { updateDocument, getDocumentVersions, restoreDocumentVersion, getDocument } from "@/lib/actions/document"
import { useToast } from "@/hooks/use-toast"

export default function DocumentPage() {
  const params = useParams()
  const documentId = params.documentId as string
  const teamId = params.team as string
  const { data: session } = useSession()
  const [document, setDocument] = useState<any>(null)
  const [versions, setVersions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDocument() {
      try {
        // Fetch document
        const docResult = await getDocument(documentId)
        if (docResult.success && docResult.document) {
          setDocument(docResult.document)
        } else {
          // Fallback mock data
          setDocument({
            id: documentId,
            title: "Getting Started Guide",
            content: {
              type: "doc",
              content: [
                {
                  type: "heading",
                  attrs: { level: 1 },
                  content: [{ type: "text", text: "Welcome to CollabFlow" }],
                },
              ],
            },
          })
        }

        // Fetch versions
        const versionsResult = await getDocumentVersions(documentId)
        if (versionsResult.success && versionsResult.versions) {
          setVersions(versionsResult.versions)
        }
      } catch (error) {
        console.error("Error fetching document:", error)
        // Fallback mock data
        setDocument({
          id: documentId,
          title: "Getting Started Guide",
          content: {
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: { level: 1 },
                content: [{ type: "text", text: "Welcome to CollabFlow" }],
              },
            ],
          },
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (documentId) {
      fetchDocument()
    }
  }, [documentId])

  const handleSave = async (content: any) => {
    setIsSaving(true)
    const formData = new FormData()
    formData.append("title", document?.title || "")
    formData.append("content", JSON.stringify(content))
    if (session?.user?.id) {
      formData.append("userId", session.user.id)
    }

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
        // Refresh versions
        const versionsResult = await getDocumentVersions(documentId)
        if (versionsResult.success && versionsResult.versions) {
          setVersions(versionsResult.versions)
        }
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

  const handleRestoreVersion = async (versionId: string) => {
    if (!session?.user?.id) return

    try {
      const result = await restoreDocumentVersion(documentId, versionId, session.user.id)
      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to restore version.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Restored",
          description: "Document version restored successfully!",
        })
        // Refresh document and versions
        window.location.reload()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore version.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    )
  }

  const currentVersion = versions.length > 0 ? versions[0].version : 1

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
            initialContent={document.content || { type: "doc", content: [] }}
            onSave={handleSave}
            userId={session?.user?.id}
            userName={session?.user?.name || "Anonymous"}
          />
          
          <div className="mt-8">
            <CommentsSectionEnhanced
              documentId={documentId}
              comments={[]}
              currentUserId={session?.user?.id || "anonymous"}
              teamId={teamId}
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
            versions={versions}
            currentVersion={currentVersion}
            onRestore={handleRestoreVersion}
          />
        </div>
      )}
    </div>
  )
}

