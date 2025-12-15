"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { RoomProvider } from "@/lib/realtime/liveblocks"
import { Bold, Italic, Heading1, Heading2, List, Quote, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PresenceIndicator } from "@/components/presence-indicator"
import { useEffect } from "react"

type CollaborativeEditorProps = {
  documentId: string
  initialContent?: any
  onSave?: (content: any) => void
}

function EditorContentComponent({ documentId, initialContent, onSave }: CollaborativeEditorProps) {
  const roomId = `document:${documentId}`

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: initialContent || "<p>Start writing...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-8",
      },
    },
    onUpdate: ({ editor }) => {
      if (onSave) {
        onSave(editor.getJSON())
      }
    },
  })

  // Auto-save debounced
  useEffect(() => {
    if (!editor || !onSave) return

    const timeoutId = setTimeout(() => {
      onSave(editor.getJSON())
    }, 2000) // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [editor?.getJSON(), onSave])

  if (!editor) {
    return <div className="p-8">Loading editor...</div>
  }

  return (
    <div className="border rounded-lg bg-background">
      {/* Toolbar */}
      <div className="border-b p-3 flex items-center justify-between bg-muted/50">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-accent" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-accent" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-accent" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "bg-accent" : ""}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "bg-accent" : ""}
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>
        <PresenceIndicator roomId={roomId} />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export function CollaborativeEditor({ documentId, initialContent, onSave }: CollaborativeEditorProps) {
  const roomId = `document:${documentId}`

  return (
    <RoomProvider id={roomId} initialPresence={{ cursor: null, currentPage: null, editingDocument: documentId }}>
      <EditorContentComponent documentId={documentId} initialContent={initialContent} onSave={onSave} />
    </RoomProvider>
  )
}

