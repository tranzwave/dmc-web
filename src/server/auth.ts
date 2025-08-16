"use server"
import { createClerkClient, Organization } from '@clerk/backend'
import { BankDetails, ClerkOrganizationPublicMetadata, ClerkUserPublicMetadata, PayherePaymentNotification } from '~/lib/types/payment';
import dotenv from 'dotenv';
import { clerkClient } from './db/db.production';
import { packages } from '~/lib/constants';
import { auth } from '@clerk/nextjs/server';
import { Permissions } from '~/lib/types/global';
import { MembersWithRoleToCheck, UserMetadataTeam } from '~/lib/types/marketingTeam';
import { or } from 'drizzle-orm';

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


const updateBankDetails = async (organizationId: string, bankDetails: BankDetails[]) => {
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

const getActiveOrganization: () => Promise<string> = async () => {
    try {
        const {orgId} = auth();
        if(!orgId){
            console.log('No active organization found');
            return '';
        }
        return orgId;
    }
    catch(error){
        console.log('Error getting active organization:', error);
        throw error;
    }
}

const updateUserPermissions = async (userId: string, permissions: Permissions[]) => {
    try {
        const existingPermissions = await clerkClient.users.getUser(userId).then(res => res.publicMetadata);
        const response = await clerkClient.users.updateUser(userId, {
            publicMetadata: {
                ...existingPermissions,
                permissions: permissions
            }
        });
        console.log('User permissions updated successfully: \n', response);
        if(response){
            return true;
        }
    } catch (error) {
        console.log('Error updating user permissions:', error);
        throw error;
    }
}

const updateUserPublicMetadata = async (userId: string, metadata: ClerkUserPublicMetadata) => {
    try {
        const response = await clerkClient.users.updateUser(userId, {
            publicMetadata: metadata
        });
        console.log('User public metadata updated successfully: \n', response);
        if(response){
            return true;
        }
    } catch (error) {
        console.log('Error updating user public metadata:', error);
        throw error;
    }
}

const updateUsersTeams = async (userId: string, teams: UserMetadataTeam[]) => {
    try {
        const existingMetadata = await clerkClient.users.getUser(userId).then(res => res.publicMetadata) as ClerkUserPublicMetadata;
        const existingTeams = existingMetadata.teams;
        const response = await clerkClient.users.updateUser(userId, {
            publicMetadata: {
                ...existingMetadata,
                teams: [...existingTeams, ...teams]
            }
        });
        console.log('User teams updated successfully: \n', response);
        if(response){
            return true;
        }
    } catch (error) {
        console.log('Error updating user teams:', error);
        throw error;
    }
}

const deleteTeamFromAllUsers = async (teamId: string, organizationId:string) => {
    try {
        const members = await clerkClient.organizations.getOrganizationMembershipList({ organizationId: organizationId }).then(res => res.data);
        
        for (const member of members) {
            const clerkUser = await clerkClient.users.getUser(member.publicUserData?.userId ?? '');
            if (!clerkUser) {
                console.log('User not found:', member.publicUserData?.userId);
                throw new Error('User not found');
            }
            const userId = member.publicUserData?.userId ?? "";
            const existingMetadata = clerkUser.publicMetadata as ClerkUserPublicMetadata;
            const existingTeams = existingMetadata.teams;
            const updatedTeams = existingTeams.filter(t => t.teamId !== teamId);

            const response = await clerkClient.users.updateUser(userId, {
                publicMetadata: {
                    ...existingMetadata,
                    teams: updatedTeams
                }
            });
            console.log('User teams updated successfully: \n', response);
        }

        return true;
    } catch (error) {
        console.log('Error deleting team from all users:', error);
        throw error;
    }
}

const updateBulkUsersTeams = async (organizationId:string, teamId:string, MembersWithRoleToCheck: MembersWithRoleToCheck) => {
    try {
        const members = await clerkClient.organizations.getOrganizationMembershipList({ organizationId: organizationId }).then(res => res.data);
        
        for (const member of members) {
            const clerkUser = await clerkClient.users.getUser(member.publicUserData?.userId ?? '');
            if (!clerkUser) {
                console.log('User not found:', member.publicUserData?.userId);
                throw new Error('User not found');
            }
            const userId = member.publicUserData?.userId ?? "";
            const existingMetadata = clerkUser.publicMetadata as ClerkUserPublicMetadata;
            const existingTeams = existingMetadata?.teams ?? [];
            const userAlreadyInTeam = existingTeams.length > 0 ? existingTeams.find(t => t.teamId === teamId) : false;

            if (MembersWithRoleToCheck.members.includes(userId) && !userAlreadyInTeam) {
                const response = await clerkClient.users.updateUser(userId, {
                    publicMetadata: {
                        ...existingMetadata,
                        teams: [...existingTeams, { teamId: teamId, role: MembersWithRoleToCheck.role, orgId: organizationId }]
                    }
                });
                console.log('User teams updated successfully: \n', response);
            } else if (!MembersWithRoleToCheck.members.includes(userId) && userAlreadyInTeam && userAlreadyInTeam.role === MembersWithRoleToCheck.role) {
                const response = await clerkClient.users.updateUser(userId, {
                    publicMetadata: {
                        ...existingMetadata,
                        teams: existingTeams.filter(t => t.teamId !== teamId)
                    }
                });
                console.log('User teams updated successfully: \n', response);
            } else if (MembersWithRoleToCheck.members.includes(userId) && userAlreadyInTeam && userAlreadyInTeam.role !== MembersWithRoleToCheck.role) {
                const response = await clerkClient.users.updateUser(userId, {
                    publicMetadata: {
                        ...existingMetadata,
                        teams: existingTeams.map(t => t.teamId === teamId ? { teamId: teamId, role: MembersWithRoleToCheck.role, orgId: organizationId } : t)
                    }
                });
                console.log('User teams updated successfully: \n', response);
            }
        }

        return true;
    } catch (error) {
        console.log('Error updating bulk users teams:', error);
        throw error;
    }
}

const getUserPublicMetadata = async (userId: string) => {
    try {
        const user = await clerkClient.users.getUser(userId);
        return user.publicMetadata as ClerkUserPublicMetadata;
    } catch (error) {
        console.log('Error getting user public metadata:', error);
        throw error;
    }
}

const getAllClerkUsersByOrgId = async (organizationId:string) => {
    try {
        const users = await clerkClient.users.getUserList({organizationId: [organizationId]}).then(res => res.data);

        return users.map(user => ({
            id: user.id,
            fullName: user.firstName + ' ' + user.lastName,
            email: user.primaryEmailAddress?.emailAddress ?? '',
            publicMetadata: user.publicMetadata as ClerkUserPublicMetadata, // Extracting public metadata if needed
        }));
    } catch (error) {
        console.log('Error getting all users:', error);
        throw error;
    }
}

const getUserById = async (userId: string) => {
    try {
        const user = await clerkClient.users.getUser(userId);
        return user;
    } catch (error) {
        console.log('Error getting user:', error);
        throw error;
    }
}

const updateOrganizationMetadata = async (OrganizationId: string, metadata: ClerkOrganizationPublicMetadata) => {
    try {
        const response = await clerkClient.organizations.updateOrganization(OrganizationId, {
            publicMetadata: metadata
        });
        console.log('Organization metadata updated successfully: \n', response);
        if(response){
            return true;
        }
    } catch (error) {
        console.log('Error updating organization metadata:', error);
        throw error;
    }
}


export {
    updateBankDetails,
    updateSubscriptionNotificationData,
    getOrganizationSubscriptionData,
    removeSubscriptionMetadata,
    getActiveOrganization,
    updateUserPermissions,
    updateUserPublicMetadata,
    updateBulkUsersTeams,
    getUserPublicMetadata,
    getAllClerkUsersByOrgId,
    deleteTeamFromAllUsers,
    getUserById,
    updateOrganizationMetadata
}