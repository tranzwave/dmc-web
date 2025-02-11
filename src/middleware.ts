import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { ClerkOrganizationPublicMetadata } from './lib/types/payment';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/',
  '/onboarding',
  //Allow access to api routes
  '/api/(.*)',
]);

// Define protected admin routes
const isProtectedRoute = createRouteMatcher(['/dashboard/admin(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, has, orgRole, redirectToSignIn, orgId} = auth();

  console.log('Session Claims: ', sessionClaims);
  console.log('Org ID: ', orgId);

  // Allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to the sign-in page
  if (!userId) {
    redirectToSignIn();
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // // Redirect user to the payment page if their organization is not subscribed
  // if (!organization.publicMetadata || !(organization.publicMetadata as ClerkOrganizationPublicMetadata).subscription?.isActive) {
  //   if (req.url.includes('/payment')) {
  //     return NextResponse.next();
  //   }

  //   return NextResponse.redirect(new URL('/payment', req.url));
  // }

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

  if (userId && !orgId ) {
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
