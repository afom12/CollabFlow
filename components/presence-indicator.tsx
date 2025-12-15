"use client"

import { useOthers, useMyPresence } from "@/lib/realtime/liveblocks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type PresenceIndicatorProps = {
  roomId: string
  maxVisible?: number
}

export function PresenceIndicator({ roomId, maxVisible = 5 }: PresenceIndicatorProps) {
  const others = useOthers()
  const [myPresence] = useMyPresence()

  const visibleOthers = others.slice(0, maxVisible)
  const remainingCount = Math.max(0, others.length - maxVisible)

  return (
    <div className="flex items-center gap-2">
      {others.length > 0 && (
        <div className="flex items-center -space-x-2">
          {visibleOthers.map((user) => (
            <TooltipProvider key={user.connectionId}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={user.presence?.avatar} alt={user.presence?.name || "User"} />
                    <AvatarFallback>
                      {(user.presence?.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.presence?.name || "Anonymous"} is editing</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {remainingCount > 0 && (
            <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
              +{remainingCount}
            </div>
          )}
        </div>
      )}
      <span className="text-xs text-muted-foreground">
        {others.length === 0 ? "Editing alone" : `${others.length} other${others.length === 1 ? "" : "s"} editing`}
      </span>
    </div>
  )
}

