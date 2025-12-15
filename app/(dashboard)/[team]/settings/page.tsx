"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeamInviteModal } from "@/components/team-invite-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useTeam } from "@/hooks/use-team"
import { MoreVertical, Trash2, Shield, User, Eye, Crown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

export default function SettingsPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params.team as string
  const { team, members, updateTeam, deleteTeam, updateRole, removeMember, isUpdating, isDeleting } = useTeam(teamId)
  
  const [teamName, setTeamName] = useState(team?.name || "")
  const [description, setDescription] = useState(team?.description || "")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    updateTeam({ name: teamName, description })
  }

  const handleDeleteTeam = () => {
    deleteTeam()
  }

  const handleRemoveMember = (userId: string) => {
    setDeletingMemberId(userId)
    removeMember(userId)
    setTimeout(() => setDeletingMemberId(null), 1000)
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRole({ userId, newRole })
  }

  const roleIcons = {
    owner: Crown,
    admin: Shield,
    member: User,
    viewer: Eye,
  }

  const roleColors = {
    owner: "bg-purple-100 text-purple-800",
    admin: "bg-blue-100 text-blue-800",
    member: "bg-green-100 text-green-800",
    viewer: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Team Settings</h1>
      
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Enter team description"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                {team?.plan && (
                  <Badge variant="outline" className="ml-2">
                    {team.plan.charAt(0).toUpperCase() + team.plan.slice(1)} Plan
                  </Badge>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <TeamInviteModal
                teamId={teamId}
                onInviteSent={() => {
                  // Refresh will happen via React Query
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((member) => {
                const RoleIcon = roleIcons[member.role as keyof typeof roleIcons] || User
                return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                      deletingMemberId === member.user.id ? "opacity-50" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.user.image || undefined} />
                        <AvatarFallback>
                          {member.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.user.name}</p>
                          {member.role === "owner" && (
                            <Badge className={roleColors[member.role as keyof typeof roleColors]}>
                              <RoleIcon className="h-3 w-3 mr-1" />
                              Owner
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{member.user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.role !== "owner" && (
                        <>
                          <Select
                            value={member.role}
                            onValueChange={(newRole) => handleRoleChange(member.user.id, newRole)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  Admin
                                </div>
                              </SelectItem>
                              <SelectItem value="member">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Member
                                </div>
                              </SelectItem>
                              <SelectItem value="viewer">
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  Viewer
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleRemoveMember(member.user.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove from team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                      {member.role === "owner" && (
                        <Badge className={roleColors.owner}>
                          <Crown className="h-3 w-3 mr-1" />
                          Owner
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
              {members.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No members yet. Invite team members to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Delete Team</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete a team, there is no going back. All documents, projects, and data will be permanently deleted.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Team"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the team
              and all of its data including documents, projects, and member associations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTeam}>
              Yes, delete team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
