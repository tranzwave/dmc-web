"use client"
import { OrganizationSwitcher, SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import LoadingLayout from '~/components/common/dashboardLoading';

const OrgSelectionPage: React.FC = () => {
    const [selectedOrg, setSelectedOrg] = useState<string>('');

    const {isSignedIn, user, isLoaded} = useUser();

    const router = useRouter();
    const pathname = usePathname();

    if(!isLoaded){
        return <div className='w-full h-full flex justify-center items-center'><LoadingLayout/></div>
    }

    if (!isSignedIn) {
        router.push('/sign-in');
        return <div>You must be signed in to access this page</div>;
    }

    if (user.organizationMemberships.length === 0) {
        // router.push('/onboarding');
        // return <div>You must be a member of an organization to access this page</div>;
        router.refresh();
    }

    return (
        <div className='flex flex-col w-full h-full justify-center items-center'>
            <div className='text-sm font-semibold'>Select an Organization</div>
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
                    </div>
                </SignedIn>
        </div>
    );
};

export default OrgSelectionPage;