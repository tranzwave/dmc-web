import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { ClerkOrganizationPublicMetadata, ClerkUserPublicMetadata } from './lib/types/payment';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/',
  '/onboarding',
  //Allow access to api routes
  '/api/(.*)',
  '/terms-and-conditions',
  '/privacy-policy',
  '/refund-policy',
]);

// Define protected admin routes
const isProtectedRoute = createRouteMatcher(['/dashboard/admin(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, has, orgRole, redirectToSignIn, orgId} = auth();


  // Allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (!userId) {
    redirectToSignIn();
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (isProtectedRoute(req)) {
    const canManage = has({ role:'org:admin' })
    const userRole = sessionClaims?.metadata?.role;
    if (!canManage) {
      const redirectUrl = new URL('/dashboard/overview', req.url);
      redirectUrl.searchParams.set('unauthenticated', 'true'); // Add query param
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (userId && !orgId ) {
    //Add a 3 second delay here to allow the org selection page to load
    await new Promise((resolve) => setTimeout(resolve, 3000));
    if (req.url.includes('/org-selection')) {
      return NextResponse.next();
    }
    
    const orgSelection = new URL('/org-selection', req.url)

    return NextResponse.redirect(orgSelection)
  }

  if(userId && orgId && req.url.includes('/org-selection')) {
    return NextResponse.redirect(new URL('/dashboard/overview', req.url));
  }

  const organizationMetadata = (sessionClaims as CustomJwtSessionClaims).organizationMetadata as ClerkOrganizationPublicMetadata;
  const subscription = organizationMetadata.subscription;
  const isOnPaymentPage = req.url.includes('/payment');
  
  if (!subscription && !isOnPaymentPage) {
    return NextResponse.redirect(new URL('/payment', req.url));
  }
  
  const { isTrial, trialEndDate, isActive } = subscription;
  
  // Redirect to payment if trial expired
  if (isTrial && !isOnPaymentPage && Date.now() > new Date(trialEndDate).getTime()) {
    return NextResponse.redirect(new URL('/payment', req.url));
  }
  
  // Redirect to payment if subscription is inactive
  if (!isActive && !isOnPaymentPage) {
    return NextResponse.redirect(new URL('/payment', req.url));
  }

  //if active and trial expired
  if (isTrial && isActive && Date.now() > new Date(trialEndDate).getTime() && isOnPaymentPage) {
    return NextResponse.next();
  }

  // Redirect away from payment if already active
  if (isActive && isOnPaymentPage) {
    return NextResponse.redirect(new URL('/dashboard/overview', req.url));
  }
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
