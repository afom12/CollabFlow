"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type User = {
  id: string
  name: string | null
  email: string
  image: string | null
}

type MentionAutocompleteProps = {
  query: string
  users: User[]
  onSelect: (user: User) => void
  position: { top: number; left: number }
  visible: boolean
}

export function MentionAutocomplete({
  query,
  users,
  onSelect,
  position,
  visible,
}: MentionAutocompleteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!visible) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredUsers.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredUsers[selectedIndex]) {
          onSelect(filteredUsers[selectedIndex])
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [visible, selectedIndex, filteredUsers, onSelect])

  if (!visible || filteredUsers.length === 0) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="absolute z-50 bg-background border rounded-lg shadow-lg max-h-64 overflow-y-auto min-w-[200px]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {filteredUsers.map((user, index) => (
        <button
          key={user.id}
          type="button"
          onClick={() => onSelect(user)}
          className={cn(
            "w-full flex items-center gap-2 p-2 hover:bg-muted transition-colors text-left",
            index === selectedIndex && "bg-muted"
          )}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>
              {(user.name || user.email).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name || user.email}</p>
            {user.name && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
          </div>
        </button>
      ))}
    </div>
  )
}

