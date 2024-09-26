import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isProtectedRoute = createRouteMatcher(['/dashboard/admin(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();

  // Allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Check if the user is trying to access a protected admin route
  if (isProtectedRoute(req)) {
    const userRole = sessionClaims?.metadata?.role;
    

    // If the user is not an admin, redirect to dashboard/overview
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/overview', req.url));
    }
  }

  // If all checks pass, allow the request to continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};





// import { NextRequest, NextResponse } from 'next/server';
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { clerkClient } from '@clerk/nextjs';

// // Route matchers for public and protected routes
// const isPublicRoute = createRouteMatcher([
//   '/sign-in(.*)',
//   '/sign-up(.*)',
// ]);

// const isProtectedRoute = createRouteMatcher(['/dashboard/admin(.*)']);

// export default clerkMiddleware(async (auth, req: NextRequest) => {
//   const { userId, sessionClaims } = await auth();

//   // Allow access to public routes
//   if (isPublicRoute(req)) {
//     return NextResponse.next();
//   }

//   // Check if user is authenticated
//   if (!userId) {
//     return NextResponse.redirect(new URL('/sign-in', req.url));
//   }

//   let userRole = sessionClaims?.metadata?.role;
//   const userPermissions = sessionClaims?.metadata?.permissions || [];

//   // Check if the permissions or role are empty in the metadata
//   if (!userRole || userPermissions.length === 0) {
//     try {
//       // Fetch user details to get the active organization ID
//       const user = await clerkClient.users.getUser(userId);
//       const activeOrgRole = user.organizationMemberships?.[0]?.role;

//       if (activeOrgRole) {
//         // Update the user's public metadata with the active organization role and permissions
//         await clerkClient.users.updateUser(userId, {
//           publicMetadata: {
//             role: activeOrgRole,
//             permissions: getPermissionsForRole(activeOrgRole), // Define permissions based on the role
//           },
//         });

//         // Set the updated role for further checks
//         userRole = activeOrgRole;
//       }
//     } catch (error) {
//       console.error('Error updating user metadata:', error);
//     }
//   }

//   // Check if the user is trying to access a protected admin route
//   if (isProtectedRoute(req)) {
//     // If the user is not an admin, redirect to dashboard/overview
//     if (userRole !== 'admin') {
//       return NextResponse.redirect(new URL('/dashboard/overview', req.url));
//     }
//   }

//   // If all checks pass, allow the request to continue
//   return NextResponse.next();
// });

// // Helper function to define permissions based on the role
// const getPermissionsForRole = (role: string): string[] => {
//   switch (role) {
//     case 'admin':
//       return [
//         'booking_activity:manage',
//         'booking_agent:manage',
//         'booking_hotel:manage',
//         'booking_invoice:manage',
//         'booking_rest:manage',
//         'booking_shops:manage',
//         'booking_transport:manage',
//         'sys_domains:manage',
//         'sys_memberships:manage',
//         'sys_profile:manage',
//         'sys_profile:delete',
//       ];
//     case 'user':
//       return [
//         'booking_activity:read',
//         'booking_agent:read',
//         'booking_hotel:read',
//         'booking_invoice:read',
//         'booking_rest:read',
//         'booking_shops:read',
//         'booking_transport:read',
//         'sys_domains:read',
//         'sys_memberships:read',
//         'sys_profile:manage',
//       ];
//     default:
//       return [];
//   }
// };

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };

