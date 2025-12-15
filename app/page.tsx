import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, FileText, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">CollabFlow</div>
          <nav className="flex gap-4 items-center">
            <Link href="/sign-in" className="text-sm hover:underline">
              Sign In
            </Link>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Collaborate. Manage. Succeed.
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A modern, real-time collaborative platform combining document editing, 
          project management, and team communication features.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/sign-up">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to collaborate
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <FileText className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Rich Documents</h3>
            <p className="text-muted-foreground">
              Create beautiful documents with real-time collaborative editing, 
              comments, and version history.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <BarChart3 className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Project Management</h3>
            <p className="text-muted-foreground">
              Track issues, plan sprints, and visualize your roadmap with 
              powerful project management tools.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <Users className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Team Communication</h3>
            <p className="text-muted-foreground">
              Stay connected with your team through real-time presence, 
              notifications, and activity feeds.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CollabFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

