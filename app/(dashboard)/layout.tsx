"use client"

import { redirect } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { SearchBar } from "@/components/search-bar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, GitBranch, BarChart3, Settings, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  // Extract team ID from pathname
  const teamId = pathname?.split("/")[1] || ""

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/activity", label: "Activity", icon: Activity },
  ]

  // Check if we're in a team route
  const isTeamRoute = pathname?.includes("/team/") || pathname?.match(/^\/[^/]+\/(docs|projects|settings|analytics)/)
  
  // Team navigation items (shown when in team routes)
  const teamNavItems = [
    { href: "/team/docs", label: "Documents", icon: FileText },
    { href: "/team/projects", label: "Projects", icon: GitBranch },
    { href: "/team/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/team/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-muted/40 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">CollabFlow</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md transition-colors",
                  isActive
                    ? "bg-background text-foreground font-medium"
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
          
          {isTeamRoute && (
            <>
              <div className="my-4 border-t" />
              <div className="text-xs font-semibold text-muted-foreground uppercase px-2 mb-2">
                Team
              </div>
              {teamNavItems.map((item) => {
                const teamHref = pathname?.split("/")[1] ? `/${pathname.split("/")[1]}${item.href.replace("/team", "")}` : item.href
                const isActive = pathname?.includes(item.href.replace("/team", ""))
                return (
                  <Link
                    key={item.href}
                    href={teamHref}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md transition-colors",
                      isActive
                        ? "bg-background text-foreground font-medium"
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </>
          )}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">User</p>
              <p className="text-xs text-muted-foreground truncate">user@example.com</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-background">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-lg font-semibold">Team Workspace</h1>
            {teamId && session?.user?.id && (
              <SearchBar teamId={teamId} userId={session.user.id} className="max-w-md" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <NotificationsDropdown />
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

