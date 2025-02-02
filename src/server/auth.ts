"use server"
import { createClerkClient } from '@clerk/backend'
import { BankDetails } from '~/lib/types/payment';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


const createClient = async () => {
    try {
        const secretKey = process.env.CLERK_SECRET_KEY;
        console.log('Creating Clerk client with secret key:', secretKey);
        const clerkClient = createClerkClient({ secretKey: secretKey })
        return clerkClient;
    } catch (error) {
        console.log('Error creating Clerk client:', error);
        throw error;
    }
}


const updateBankDetails = async (organizationId: string, bankDetails: BankDetails) => {
    try {
        const clerkClient = await createClient();
        const organization = await clerkClient.organizations.getOrganization({ organizationId: organizationId });
        const response = await clerkClient.organizations.updateOrganization(organizationId, {
            publicMetadata: {
                ...organization.publicMetadata,
                bankDetails: bankDetails
            }
        });
        console.log('Bank details updated successfully: \n', response);
    } catch (error) {
        console.log('Error updating bank details:', error);
        throw error;
    }
}



export {
    updateBankDetails,
    createClient
}