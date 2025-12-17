"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Activity, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/activity", label: "Activity", icon: Activity },
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
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Team Workspace</h1>
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

