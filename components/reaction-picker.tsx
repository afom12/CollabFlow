"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"
import { cn } from "@/lib/utils"

const EMOJI_LIST = [
  "👍", "❤️", "😄", "🎉", "👏", "🔥", "💯", "🚀",
  "✨", "💡", "👀", "🤔", "😮", "😢", "🙏", "✅",
]

type ReactionPickerProps = {
  onSelect: (emoji: string) => void
  existingReactions?: Array<{ emoji: string; count: number; userReacted: boolean }>
}

export function ReactionPicker({ onSelect, existingReactions = [] }: ReactionPickerProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (emoji: string) => {
    onSelect(emoji)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="grid grid-cols-4 gap-1">
          {EMOJI_LIST.map((emoji) => {
            const existing = existingReactions.find((r) => r.emoji === emoji)
            return (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelect(emoji)}
                className={cn(
                  "p-2 rounded hover:bg-muted transition-colors text-lg",
                  existing?.userReacted && "bg-primary/10"
                )}
                title={existing ? `${existing.count} reactions` : undefined}
              >
                {emoji}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

