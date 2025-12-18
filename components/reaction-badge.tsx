"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ReactionBadgeProps = {
  emoji: string
  count: number
  userReacted: boolean
  onClick: () => void
}

export function ReactionBadge({ emoji, count, userReacted, onClick }: ReactionBadgeProps) {
  if (count === 0) return null

  return (
    <Button
      variant={userReacted ? "default" : "outline"}
      size="sm"
      className={cn(
        "h-7 px-2 text-xs gap-1",
        userReacted && "bg-primary/10 hover:bg-primary/20"
      )}
      onClick={onClick}
    >
      <span>{emoji}</span>
      <span>{count}</span>
    </Button>
  )
}

