import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // If authenticated but onboarding not complete, redirect to onboarding
    if (
      token &&
      !(token as any).onboardingCompleto &&
      pathname.startsWith('/app') &&
      !pathname.startsWith('/onboarding')
    ) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }

    // Admin route protection
    if (pathname.startsWith('/admin') && (token as any)?.papel !== 'admin') {
      return NextResponse.redirect(new URL('/app/home', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        // Allow public routes
        if (
          pathname.startsWith('/login') ||
          pathname.startsWith('/api/auth') ||
          pathname === '/'
        ) {
          return true
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/app/:path*', '/admin/:path*', '/onboarding/:path*'],
}
