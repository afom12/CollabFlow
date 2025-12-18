"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { createMessage, getMessages } from "@/lib/actions/message"
import { ReactionPicker } from "@/components/reaction-picker"
import { ReactionBadge } from "@/components/reaction-badge"
import { MentionAutocomplete } from "@/components/mention-autocomplete"
import { extractMentions } from "@/lib/utils/mentions"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  author: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  mentions: string[]
  reactions?: Array<{
    emoji: string
    count: number
    users: Array<{ id: string; name: string | null }>
  }>
  createdAt: Date
}

type TeamChatProps = {
  teamId: string
  userId: string
  teamMembers: Array<{
    id: string
    name: string | null
    email: string
    image: string | null
  }>
}

export function TeamChat({ teamId, userId, teamMembers }: TeamChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const [showMentions, setShowMentions] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [teamId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadMessages = async () => {
    const result = await getMessages(teamId)
    if (result.success && result.messages) {
      setMessages(result.messages)
      setIsLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const result = await createMessage(teamId, newMessage, userId)
    
    if (result.success) {
      setNewMessage("")
      await loadMessages()
    }
    setIsSending(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setNewMessage(value)

    // Check for @mentions
    const cursorPosition = e.target.selectionStart
    const textBeforeCursor = value.substring(0, cursorPosition)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

    if (mentionMatch) {
      const rect = e.target.getBoundingClientRect()
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

  const handleMentionSelect = (user: typeof teamMembers[0]) => {
    const cursorPosition = textareaRef.current?.selectionStart || 0
    const textBeforeCursor = newMessage.substring(0, cursorPosition)
    const textAfterCursor = newMessage.substring(cursorPosition)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

    if (mentionMatch) {
      const newText =
        textBeforeCursor.substring(0, mentionMatch.index) +
        `@${user.name || user.email} ` +
        textAfterCursor
      setNewMessage(newText)
      setShowMentions(false)
      setTimeout(() => {
        textareaRef.current?.focus()
        const newPosition = mentionMatch.index! + `@${user.name || user.email} `.length
        textareaRef.current?.setSelectionRange(newPosition, newPosition)
      }, 0)
    }
  }

  const formatMessageContent = (content: string) => {
    const mentions = extractMentions(content)
    let formatted = content

    mentions.forEach((mention) => {
      const user = teamMembers.find(
        (u) =>
          u.name?.toLowerCase() === mention.userName.toLowerCase() ||
          u.email.toLowerCase() === mention.userName.toLowerCase()
      )
      if (user) {
        formatted = formatted.replace(
          `@${mention.userName}`,
          `<span class="font-medium text-primary">@${user.name || user.email}</span>`
        )
      }
    })

    return formatted
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle>Team Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.author.image || undefined} />
                  <AvatarFallback>
                    {(message.author.name || message.author.email).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {message.author.name || message.author.email}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <div
                    className="text-sm whitespace-pre-wrap mb-2"
                    dangerouslySetInnerHTML={{
                      __html: formatMessageContent(message.content),
                    }}
                  />
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {message.reactions.map((reaction) => (
                        <ReactionBadge
                          key={reaction.emoji}
                          emoji={reaction.emoji}
                          count={reaction.count}
                          userReacted={reaction.users.some((u) => u.id === userId)}
                          onClick={() => {
                            // Toggle reaction
                            console.log("Toggle reaction", reaction.emoji)
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="relative">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(e)
                }
              }}
              placeholder="Type a message... Use @ to mention someone"
              rows={3}
              className="pr-20"
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button type="submit" size="icon" className="h-8 w-8" disabled={isSending || !newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {showMentions && (
            <MentionAutocomplete
              query={mentionQuery}
              users={teamMembers}
              onSelect={handleMentionSelect}
              position={mentionPosition}
              visible={showMentions}
            />
          )}
        </form>
      </CardContent>
    </Card>
  )
}

