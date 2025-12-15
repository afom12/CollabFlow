"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Send, Reply } from "lucide-react"
import { createComment } from "@/lib/actions/comment"

type Comment = {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
  replies?: Comment[]
}

type CommentsSectionProps = {
  documentId?: string
  issueId?: string
  comments: Comment[]
  currentUserId: string
  onCommentAdded?: () => void
}

export function CommentsSection({
  documentId,
  issueId,
  comments,
  currentUserId,
  onCommentAdded,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("content", newComment)
    if (documentId) formData.append("documentId", documentId)
    if (issueId) formData.append("issueId", issueId)
    if (replyingTo) formData.append("parentId", replyingTo)

    try {
      await createComment(formData)
      setNewComment("")
      setReplyingTo(null)
      setReplyContent("")
      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
    setIsSubmitting(false)
  }

  const handleReply = async (parentId: string, e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("content", replyContent)
    if (documentId) formData.append("documentId", documentId)
    if (issueId) formData.append("issueId", issueId)
    formData.append("parentId", parentId)

    try {
      await createComment(formData)
      setReplyingTo(null)
      setReplyContent("")
      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (error) {
      console.error("Failed to add reply:", error)
    }
    setIsSubmitting(false)
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={isReply ? "ml-8 mt-3" : ""}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            {comment.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          </div>
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-7 text-xs"
              onClick={() => setReplyingTo(comment.id)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          )}
          {replyingTo === comment.id && (
            <form onSubmit={(e) => handleReply(comment.id, e)} className="mt-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  Reply
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>

        <div className="space-y-4 pt-4 border-t">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => renderComment(comment))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

