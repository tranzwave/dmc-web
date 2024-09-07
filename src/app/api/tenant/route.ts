// pages/api/create-tenant.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

type CreateParams = {
  name: string;
  createdBy: string;
  publicMetadata: {
    country: string;
    domainName: string;
  };
};

export async function POST(req: Request, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log(req)
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const data: CreateParams = await req.json();

  try {
    const response = await clerkClient().organizations.createOrganization({
      name: data.name,
      createdBy: data.createdBy,
      publicMetadata: {
        country: data.publicMetadata.country,
        domainName: data.publicMetadata.domainName,
      },
    });

    if (!response) {
      throw new Error('Error creating organization');
    }
    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    // console.error(error);
    // res.status(500).json({ message: 'Internal server error', error });
    return NextResponse.json({ error }, { status: 500 });
  }
}
