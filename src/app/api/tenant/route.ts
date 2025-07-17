import { NextApiRequest, NextApiResponse } from "next";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { subscription, tenant } from "~/server/db/schema";
import { DrizzleError, or } from "drizzle-orm";
import { ClerkAPIError } from "@clerk/types";
import { permissionsList } from "~/lib/constants";

type CreateParams = {
  id: string;
  name: string;
  createdBy: string;
  publicMetadata: {
    country: string;
    domainName: string;
    website: string;
    contactNumber: string;
    address: string;
  };
  userData: {
    contact: string;
    address: string;
  };
};

type CoordError = {
  message: string;
  code: number;
}

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const data: CreateParams = await req.json();
  let organizationId: string | null = null;

  try {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);
    // Step 1: Create Organization in Clerk
    const organizationResponse = await clerkClient.organizations.createOrganization({
      name: data.name,
      maxAllowedMemberships: 1,
      createdBy: data.createdBy,
      publicMetadata: {
        country: data.publicMetadata.country,
        domainName: data.publicMetadata.domainName,
        website: data.publicMetadata.website,
        contactNumber: data.publicMetadata.contactNumber,
        address: data.publicMetadata.address,
        primaryCurrency: "USD",
        subscription: {
          plan: "Free",
          payhereId: '',
          isTrial: true,
          isActive:true,
          trialEndDate: trialEndDate.toISOString(),
        }
      },
    });

    if (!organizationResponse) {
      throw new Error("Error creating organization in Clerk");
    }

    organizationId = organizationResponse.id;

    // Step 2: Update User Metadata
    const userResponse = await clerkClient.users.updateUserMetadata(data.id, {
      publicMetadata: {
        role: "admin",
        permissions: [...permissionsList],
        info: {
          contact: data.userData.contact,
          address: data.userData.address,
        },
        teams: [],
      },
    });

    if (!userResponse) {
      throw new Error("Error making the user admin");
    }

    // Step 3: Create Tenant & Subscription
    const tenantAndSubscription = await db.transaction(async (trx) => {
      const dbTenant = await trx.insert(tenant).values({
        id: organizationResponse.id,
        clerkId: organizationResponse.id,
        country: data.publicMetadata.country,
        name: data.name,
        domain: data.publicMetadata.domainName,
        subscriptionPlan: "basic",
      }).returning();

      if (!dbTenant || !dbTenant[0]) {
        throw new Error("Error creating organization in DB");
      }

      const tenantId = dbTenant[0].id;
      const clerkOrgId = dbTenant[0].clerkId;

      const createdDate = new Date(organizationResponse.createdAt);
      const trialEndDate = new Date(createdDate);
      trialEndDate.setDate(trialEndDate.getDate() + 30);

      const dbSubscription = await trx.insert(subscription).values({
        clerkOrgId: clerkOrgId,
        tenantId: tenantId,
        plan: "none",
        startDate: createdDate,
        isTrial: true,
        trialEndDate: trialEndDate,
        clerkUserId: userResponse.id,
        nextBillingDate: trialEndDate,
        endDate: new Date("2050/12/31"),
      }).returning();

      if (!dbSubscription || !dbSubscription[0]) {
        throw new Error("Error creating subscription in DB");
      }

      return { dbSubscription: dbSubscription[0], dbTenant: dbTenant[0] };
    });

    // Step 4: Return response
    return NextResponse.json(
      {
        organization: organizationResponse.id,
        user: userResponse.id,
        clerkResponse: organizationResponse.id,
        subscription: tenantAndSubscription.dbSubscription.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error);

    // Cleanup: Delete the organization if it was created before the error
    if (organizationId) {
      try {
        await clerkClient.organizations.deleteOrganization(organizationId);
      } catch (cleanupError) {
        console.error("Failed to delete organization during cleanup:", cleanupError);
      }
    }

    return NextResponse.json(
      { message: (error.detail ?? error.message) || "Internal server error" },
      { status: 500 }
    );
  }
}

