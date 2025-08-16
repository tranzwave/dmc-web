'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OrganizationSwitcher, SignedIn, useOrganization, UserButton, useUser } from '@clerk/nextjs';
import EnhancedPaymentPackages from '~/components/payment/PaymentForm';
import LoadingLayout from '~/components/common/dashboardLoading';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
}

interface PaymentPageProps {
    searchParams: { packageId: string; organizationId: string; packageName: string };
}



const PaymentPage = ({ searchParams }: PaymentPageProps) => {

    const pathname = usePathname();
    const { organization, isLoaded } = useOrganization();
    const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const router = useRouter();

    const onCloseDialog = () => {
        return
    }

    // Check whether user is an admin of the active organization
    useEffect(() => {
        async function checkAdminRole() {
            if (organization && user) {
                const orgRoles = await organization.getRoles();
                const userMemberships = await user.getOrganizationMemberships();
                const orgMembership = userMemberships.data.find((membership) => membership.organization.id === organization.id);

                if (orgMembership && orgMembership.role === 'org:admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            }
            return false;
        }

        checkAdminRole();

    }, [user])

    if(!isSignedIn) {
        router.replace('/sign-in');
        return null;
    }

    if (!isLoaded || !organization || !isUserLoaded || !user || isAdmin === null) {
        return (
            <div>
                <div className='w-full flex flex-row justify-end items-center p-3'>
                    <SignedIn>
                        <div className="flex flex-row gap-3">
                            <OrganizationSwitcher
                                defaultOpen={false}
                                hidePersonal={true}
                                appearance={{
                                    elements: {
                                        organizationSwitcherPopoverActionButton__createOrganization:
                                            "hidden",
                                    },
                                }}
                                afterSelectOrganizationUrl={(org) => {
                                    return pathname;
                                }
                                }
                            />
                            <UserButton />
                        </div>
                    </SignedIn>
                </div>
                <div className='h-full w-full flex justify-center items-center'>
                    <LoadingLayout />
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='w-full flex flex-row justify-end items-center p-3'>
                <SignedIn>
                    <div className="flex flex-row gap-3">
                        <OrganizationSwitcher
                            defaultOpen={false}
                            hidePersonal={true}
                            appearance={{
                                elements: {
                                    organizationSwitcherPopoverActionButton__createOrganization:
                                        "hidden",
                                },
                            }}
                            afterSelectOrganizationUrl={(org) => {
                                return pathname;
                            }
                            }
                        />
                        <UserButton />
                    </div>
                </SignedIn>
            </div>

            {isAdmin ? (
                <div>
                    <div className='w-full flex justify-center items-center text-sm font-medium'>Please select a package to continue</div>
                    <EnhancedPaymentPackages onCloseDialog={onCloseDialog} />
                </div>

            ) : (
                <div className='w-full flex flex-col items-center justify-center'>
                    <div className='text-lg font-semibold'>You are not authorized to access this page</div>
                    <div className='text-sm font-normal'>Your organization doesn't have an active subscription plan. Please contact your admin</div>
                </div>
            )}

        </div>
    );
};

export default PaymentPage;
