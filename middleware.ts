import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple middleware for NextAuth v5 - auth protection can be added later
export function middleware(request: NextRequest) {
  // For now, allow all routes
  // TODO: Add authentication check when NextAuth is fully configured
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
