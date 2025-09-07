// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require auth
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/clerk/webhooks'
])

export default clerkMiddleware(async (auth, req) => {
  // Protect all non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all non-static pages
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
