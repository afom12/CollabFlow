"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { TeamChat } from "@/components/team-chat"
import { getTeamMembers } from "@/lib/actions/team"
import { Loader2 } from "lucide-react"

export default function ChatPage() {
  const params = useParams()
  const teamId = params.team as string
  const { data: session } = useSession()
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: string
    name: string | null
    email: string
    image: string | null
  }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTeamMembers() {
      if (!teamId) return

      const result = await getTeamMembers(teamId)
      if (result.success && result.members) {
        const members = result.members.map((member: any) => ({
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          image: member.user.image,
        }))
        setTeamMembers(members)
      }
      setIsLoading(false)
    }

    loadTeamMembers()
  }, [teamId])

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session?.user?.id) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Please sign in to access team chat</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <TeamChat
        teamId={teamId}
        userId={session.user.id}
        teamMembers={teamMembers}
      />
    </div>
  )
}

