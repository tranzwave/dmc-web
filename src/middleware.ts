import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/onboarding',
  '/payment(.*)',
]);

// Define protected admin routes
const isProtectedRoute = createRouteMatcher(['/dashboard/admin(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, has, orgRole } = auth();

  // Allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to the sign-in page
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Handle protected admin routes
  if (isProtectedRoute(req)) {
    const canManage = has({ role:'org:admin' })
    const userRole = sessionClaims?.metadata?.role;
    console.log('Role:------------------------------------------------------------------- ' , orgRole)
    console.log('Can Manage:------------------------------------------------------------------- ' , canManage)



    // If the user is not an admin, redirect to the overview dashboard with a query parameter
    if (!canManage) {
      const redirectUrl = new URL('/dashboard/overview', req.url);
      redirectUrl.searchParams.set('unauthenticated', 'true'); // Add query param
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Allow the request to continue for all other routes
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static assets and Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run middleware for API routes
    '/(api|trpc)(.*)',
  ],
};
