"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { DocumentTemplates } from "@/components/document-templates"
import { useDocuments } from "@/hooks/use-documents"
import { useToast } from "@/hooks/use-toast"
import { Plus, FileText, Clock, User, MoreVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function DocsPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params.team as string
  const { documents, createDocument, deleteDocument, isLoading, isCreating } = useDocuments(teamId)
  const [open, setOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [documentTitle, setDocumentTitle] = useState("")
  const { toast } = useToast()

  async function handleCreateDocument(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (!documentTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a document title",
        variant: "destructive",
      })
      return
    }

    createDocument(
      {
        title: documentTitle,
        content: selectedTemplate?.content || null,
        templateId: selectedTemplate?.id,
      },
      {
        onSuccess: (result: any) => {
          if (result?.success && result?.document?.id) {
            router.push(`/${teamId}/docs/${result.document.id}`)
          }
          setOpen(false)
          setDocumentTitle("")
          setSelectedTemplate(null)
        },
      }
    )
  }

  const handleDelete = (documentId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this document?")) {
      deleteDocument(documentId)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-muted-foreground">
            Create and collaborate on documents with your team
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
            </DialogHeader>
            {!selectedTemplate ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a template to get started, or start with a blank document.
                </p>
                <DocumentTemplates onSelectTemplate={setSelectedTemplate} />
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTemplate({ id: "blank", content: null })}
                  >
                    Start Blank
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateDocument} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title *</Label>
                  <Input
                    id="title"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    placeholder="Enter document title"
                    required
                    autoFocus
                  />
                </div>
                {selectedTemplate.id !== "blank" && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-1">Template: {selectedTemplate.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedTemplate.description}</p>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedTemplate(null)
                      setDocumentTitle("")
                    }}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Document"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first document to start collaborating with your team.
            </p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc: any) => (
            <Link key={doc.id} href={`/${teamId}/docs/${doc.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate mb-1">{doc.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {doc.author?.name || "Unknown"}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => handleDelete(doc.id, e)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Document</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
