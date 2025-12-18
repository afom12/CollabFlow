"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Send, Reply, Paperclip } from "lucide-react"
import { createComment } from "@/lib/actions/comment"
import { ReactionPicker } from "@/components/reaction-picker"
import { ReactionBadge } from "@/components/reaction-badge"
import { MentionAutocomplete } from "@/components/mention-autocomplete"
import { FileUpload } from "@/components/file-upload"
import { toggleReaction, getReactions } from "@/lib/actions/reaction"
import { createAttachment } from "@/lib/actions/attachment"
import { getTeamMembers } from "@/lib/actions/team"
import { extractMentions, formatMentions } from "@/lib/utils/mentions"
import { cn } from "@/lib/utils"

type Comment = {
  id: string
  content: string
  mentions?: string[]
  author: {
    id: string
    name: string | null
    email: string
    avatar?: string | null
  }
  createdAt: Date
  replies?: Comment[]
  reactions?: Array<{
    emoji: string
    count: number
    userReacted: boolean
  }>
}

type CommentsSectionEnhancedProps = {
  documentId?: string
  issueId?: string
  comments: Comment[]
  currentUserId: string
  teamId?: string
  onCommentAdded?: () => void
}

export function CommentsSectionEnhanced({
  documentId,
  issueId,
  comments,
  currentUserId,
  teamId,
  onCommentAdded,
}: CommentsSectionEnhancedProps) {
  const params = useParams()
  const { data: session } = useSession()
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: string
    name: string | null
    email: string
    image: string | null
  }>>([])
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const [showMentions, setShowMentions] = useState(false)
  const [commentReactions, setCommentReactions] = useState<Record<string, any>>({})
  const [showFileUpload, setShowFileUpload] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null)

  const actualTeamId = teamId || (params.team as string)

  useEffect(() => {
    async function loadTeamMembers() {
      if (!actualTeamId) return
      const result = await getTeamMembers(actualTeamId)
      if (result.success && result.members) {
        const members = result.members.map((member: any) => ({
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          image: member.user.image,
        }))
        setTeamMembers(members)
      }
    }
    loadTeamMembers()
  }, [actualTeamId])

  useEffect(() => {
    // Load reactions for all comments
    async function loadReactions() {
      const reactionsMap: Record<string, any> = {}
      for (const comment of comments) {
        const result = await getReactions(comment.id, undefined)
        if (result.success && result.reactions) {
          reactionsMap[comment.id] = result.reactions.map((r: any) => ({
            emoji: r.emoji,
            count: r.count,
            userReacted: r.users.some((u: any) => u.id === currentUserId),
          }))
        }
      }
      setCommentReactions(reactionsMap)
    }
    if (comments.length > 0) {
      loadReactions()
    }
  }, [comments, currentUserId])

  const handleInputChange = (value: string, isReply = false) => {
    if (isReply) {
      setReplyContent(value)
    } else {
      setNewComment(value)
    }

    // Check for @mentions
    const textarea = isReply ? replyTextareaRef.current : textareaRef.current
    if (!textarea) return

    const cursorPosition = textarea.selectionStart
    const textBeforeCursor = value.substring(0, cursorPosition)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

    if (mentionMatch) {
      const rect = textarea.getBoundingClientRect()
      setMentionQuery(mentionMatch[1])
      setMentionPosition({
        top: rect.top - 200,
        left: rect.left + 20,
      })
      setShowMentions(true)
    } else {
      setShowMentions(false)
    }
  }

  const handleMentionSelect = (user: typeof teamMembers[0], isReply = false) => {
    const textarea = isReply ? replyTextareaRef.current : textareaRef.current
    if (!textarea) return

    const cursorPosition = textarea.selectionStart
    const value = isReply ? replyContent : newComment
    const textBeforeCursor = value.substring(0, cursorPosition)
    const textAfterCursor = value.substring(cursorPosition)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

    if (mentionMatch) {
      const newText =
        textBeforeCursor.substring(0, mentionMatch.index) +
        `@${user.name || user.email} ` +
        textAfterCursor

      if (isReply) {
        setReplyContent(newText)
      } else {
        setNewComment(newText)
      }

      setShowMentions(false)
      setTimeout(() => {
        textarea.focus()
        const newPosition = mentionMatch.index! + `@${user.name || user.email} `.length
        textarea.setSelectionRange(newPosition, newPosition)
      }, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("content", newComment)
    if (documentId) formData.append("documentId", documentId)
    if (issueId) formData.append("issueId", issueId)
    if (replyingTo) formData.append("parentId", replyingTo)
    if (actualTeamId) formData.append("teamId", actualTeamId)
    if (currentUserId) formData.append("authorId", currentUserId)

    try {
      await createComment(formData)
      setNewComment("")
      setReplyingTo(null)
      setReplyContent("")
      setShowFileUpload(false)
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
    if (actualTeamId) formData.append("teamId", actualTeamId)
    if (currentUserId) formData.append("authorId", currentUserId)

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

  const handleReaction = async (commentId: string, emoji: string) => {
    const result = await toggleReaction(emoji, currentUserId, commentId, undefined)
    if (result.success) {
      // Reload reactions for this comment
      const reactionsResult = await getReactions(commentId, undefined)
      if (reactionsResult.success && reactionsResult.reactions) {
        setCommentReactions((prev) => ({
          ...prev,
          [commentId]: reactionsResult.reactions.map((r: any) => ({
            emoji: r.emoji,
            count: r.count,
            userReacted: r.users.some((u: any) => u.id === currentUserId),
          })),
        }))
      }
    }
  }

  const handleFileUpload = async (files: File[]) => {
    // TODO: Upload files to storage (UploadThing, S3, etc.)
    // For now, just log
    console.log("Files to upload:", files)
    // After upload, create attachments
    // await createAttachment({ ... })
  }

  const renderComment = (comment: Comment, isReply = false) => {
    const reactions = commentReactions[comment.id] || comment.reactions || []
    const formattedContent = formatMentions(comment.content, teamMembers)

    return (
      <div key={comment.id} className={isReply ? "ml-8 mt-3" : ""}>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar || undefined} />
            <AvatarFallback>
              {(comment.author.name || comment.author.email).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{comment.author.name || comment.author.email}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </span>
              </div>
              <div
                className="text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              {!isReply && (
                <>
                  <ReactionPicker
                    onSelect={(emoji) => handleReaction(comment.id, emoji)}
                    existingReactions={reactions}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                </>
              )}
              {reactions.length > 0 && (
                <div className="flex gap-1">
                  {reactions.map((reaction) => (
                    <ReactionBadge
                      key={reaction.emoji}
                      emoji={reaction.emoji}
                      count={reaction.count}
                      userReacted={reaction.userReacted}
                      onClick={() => handleReaction(comment.id, reaction.emoji)}
                    />
                  ))}
                </div>
              )}
            </div>
            {replyingTo === comment.id && (
              <form onSubmit={(e) => handleReply(comment.id, e)} className="mt-2 space-y-2">
                <div className="relative">
                  <Textarea
                    ref={replyTextareaRef}
                    value={replyContent}
                    onChange={(e) => handleInputChange(e.target.value, true)}
                    placeholder="Write a reply... Use @ to mention someone"
                    rows={2}
                    className="mb-2"
                  />
                  {showMentions && (
                    <MentionAutocomplete
                      query={mentionQuery}
                      users={teamMembers}
                      onSelect={(user) => handleMentionSelect(user, true)}
                      position={mentionPosition}
                      visible={showMentions}
                    />
                  )}
                </div>
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
  }

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
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Add a comment... Use @ to mention someone"
              rows={3}
              className="pr-10"
            />
            {showMentions && (
              <MentionAutocomplete
                query={mentionQuery}
                users={teamMembers}
                onSelect={(user) => handleMentionSelect(user)}
                position={mentionPosition}
                visible={showMentions}
              />
            )}
          </div>
          {showFileUpload && (
            <FileUpload
              onUpload={handleFileUpload}
              maxSize={10}
              multiple={false}
            />
          )}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowFileUpload(!showFileUpload)}
              >
                <Paperclip className="h-4 w-4 mr-1" />
                Attach
              </Button>
            </div>
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

