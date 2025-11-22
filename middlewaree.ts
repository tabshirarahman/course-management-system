import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

const protectedRoutes = {
  "/dashboard/admin": ["admin"],
  "/dashboard/teacher": ["admin", "teacher"],
  "/dashboard/student": ["admin", "teacher", "student"],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route needs protection
  const protectedRoute = Object.entries(protectedRoutes).find(([route]) => pathname.startsWith(route))

  if (!protectedRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const payload = verifyToken(token)

  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const [, allowedRoles] = protectedRoute
  if (!allowedRoles.includes(payload.role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", payload.userId)
  requestHeaders.set("x-user-role", payload.role)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/dashboard/:path*"],
  runtime: "nodejs",
};
