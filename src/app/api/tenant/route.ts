import { NextApiRequest, NextApiResponse } from 'next';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { tenant } from '~/server/db/schema';

type CreateParams = {
  id:string
  name: string;
  createdBy: string;
  publicMetadata: {
    country: string;
    domainName: string;
    website: string,
    contactNumber: string,
    address: string
  };
  userData: {
    contact: string,
    address: string
  }
};

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const data: CreateParams = await req.json();

  try {
    const response = await clerkClient.organizations.createOrganization({
      name: data.name,
      createdBy: data.createdBy,
      publicMetadata: {
        country: data.publicMetadata.country,
        domainName: data.publicMetadata.domainName,
        website: data.publicMetadata.website,
        contactNumber: data.publicMetadata.contactNumber,
        address: data.publicMetadata.address
      },
    });

    if (!response) {
      throw new Error('Error creating organization');
    }



    const metadataResponse = await clerkClient.users.updateUserMetadata(data.id, {
      publicMetadata: {
        role: "admin",
        permissions: [
          "booking_activity:manage",
          "booking_agent:manage",
          "booking_hotel:manage",
          "booking_invoice:manage",
          "booking_rest:manage",
          "booking_shops:manage",
          "booking_transport:manage",
          "sys_domains:manage",
          "sys_domains:read",
          "sys_memberships:manage",
          "sys_memberships:read",
          "sys_profile:delete",
          "sys_profile:manage"
        ],
        info: {
          contact: data.userData.contact,
          address: data.userData.address
        }
      },
    })

    if(!metadataResponse){
      throw new Error('Error making the user admin');
    }

    const dbTenant = await db
    .insert(tenant)
    .values({
      id:response.id,
      clerkId: response.id,
      country: data.publicMetadata.country,
      name: data.name,
      domain: data.publicMetadata.domainName,
      subscriptionPlan: 'basic',
    });

  if(!dbTenant){
    throw new Error('Error creating organization');
  }

    // Step 4: Return the newly created organization details
    return NextResponse.json({ tenant: dbTenant, clerkResponse: response.id }, { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}
