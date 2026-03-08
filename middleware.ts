import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/settings(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // if admin has logged in (frontend sets a simple tpc cookie), prevent
  // them from accessing student-facing pages
  const tpc = req.cookies.get('tpc')?.value;
  if (tpc) {
    const forbidden = [
      '/jobs',
      '/resume-analyzer',
      '/hr-prep',
    ];
    if (forbidden.some(p => req.nextUrl.pathname.startsWith(p))) {
      return NextResponse.redirect(new URL('/tpc/dashboard', req.url));
    }
  }

  // Jwt protection for the TPC dashboard was previously here, but the
  // cookie is managed by the backend on a different port and Next.js
  // middleware doesn't reliably see it.  We instead handle auth inside
  // the dashboard component (API calls return 401 and trigger a redirect).
  if (req.nextUrl.pathname.startsWith('/tpc/dashboard')) {
    // intentionally no-op
  }

  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL("/student/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)"
  ]
};
