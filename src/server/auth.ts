"use server"
import { createClerkClient } from '@clerk/backend'
import { BankDetails, PayherePaymentNotification } from '~/lib/types/payment';
import dotenv from 'dotenv';
import { clerkClient } from './db/db.production';
import { packages } from '~/lib/constants';

// Load environment variables from .env file
dotenv.config();


// const createClient = async () => {
//     try {
//         const secretKey = process.env.CLERK_SECRET_KEY;
//         console.log('Creating Clerk client with secret key:', secretKey);
//         const clerkClient = createClerkClient({ secretKey: secretKey })
//         return clerkClient;
//     } catch (error) {
//         console.log('Error creating Clerk client:', error);
//         throw error;
//     }
// }

const createOrganization = async () => {
    try {
        const response = await clerkClient.organizations.createOrganization({
            name: 'Acme Inc.',
            publicMetadata: {
                industry: 'Technology',
                employeeCount: 100,
            },
            privateMetadata: {
                location: 'San Francisco',
            },
            slug: 'acme-inc',
            createdBy: 'user_01',
            maxAllowedMemberships: 10       
        });
        console.log('Organization created successfully: \n', response);
    } catch (error) {
        console.log('Error creating organization:', error);
        throw error;
    }
}


const updateBankDetails = async (organizationId: string, bankDetails: BankDetails) => {
    try {
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

const updateSubscriptionNotificationData = async (organizationId: string, notificationData: PayherePaymentNotification) => {
    console.log('Updating subscription notification data:', notificationData);
    try {
        if(notificationData.status_code !== '2') {
            console.log('Payment not successful. Skipping update.');
            return;
        }
        const organization = await clerkClient.organizations.getOrganization({ organizationId: organizationId });
        const response = await clerkClient.organizations.updateOrganization(organizationId, {
            privateMetadata: {
                subscriptionNotificationData: notificationData
            },
            publicMetadata: {
                ...organization.publicMetadata,
                subscription: {
                    isTrial: false,
                    plan: notificationData.custom_2,
                    payhereId: notificationData.subscription_id ?? "",
                    isActive: true,
                    trialEndDate: ""
                }
            }
        });
        if (response) {
            console.log('Subscription notification data updated successfully: \n', response);
            const membershipIncreseResponse = await clerkClient.organizations.updateOrganization(organizationId, {
                maxAllowedMemberships: Number(packages.find(p => p.name === notificationData.custom_2)?.users) ?? 1
            });

            console.log('Membership increased successfully: \n', membershipIncreseResponse);

        }
        console.log('Subscription notification data updated successfully: \n', response);
    } catch (error) {
        console.log('Error updating subscription notification data:', error);
        throw error;
    }
}

const getOrganizationSubscriptionData = async (organizationId: string) => {
    try {
        const organization = await clerkClient.organizations.getOrganization({ organizationId: organizationId });
        console.log('Subscription data:', organization.privateMetadata.subscriptionNotificationData);
        return organization.privateMetadata.subscriptionNotificationData as PayherePaymentNotification;
    } catch (error) {
        console.log('Error getting subscription data:', error);
        throw error;
    }
}

const removeSubscriptionMetadata = async (organizationId: string):Promise<boolean> => {
    try {
        const organization = await clerkClient.organizations.getOrganization({ organizationId: organizationId });
        // const membersList = await clerkClient.organizations.getOrganizationMembershipList({ organizationId: organizationId }).then(res => res.data);
        
        // if (membersList) {
            
        // }
        const response = await clerkClient.organizations.updateOrganization(organizationId, {
            publicMetadata: {
                ...organization.publicMetadata,
                subscription: {
                    isTrial: false,
                    plan: 'None',
                    payhereId: '',
                    isActive: false,
                    trialEndDate: ''
                }
            },
            privateMetadata: {
                subscriptionNotificationData: null
            },
            maxAllowedMemberships: 1
        });
        console.log('Subscription cancelled successfully: \n', response);
        return true;
    } catch (error) {
        console.log('Error cancelling subscription:', error);
        throw error;
    }
}


export {
    updateBankDetails,
    updateSubscriptionNotificationData,
    getOrganizationSubscriptionData,
    removeSubscriptionMetadata
}