"use client";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { OrganizationMembershipResource } from "@clerk/types";
import { useEffect, useState } from "react";
import { SelectCountry, SelectMarketingTeam } from "~/server/db/schemaTypes";
import { getAllMarketingTeams } from "~/server/db/queries/marketingTeams";
import { MarketingTeamTable } from "./marketingTeamTable";
import { Button } from "~/components/ui/button";
import AddMarketingTeamModal from "./addTeamModal";
import { getAllClerkUsersByOrgId } from "~/server/auth";
import { PartialClerkUser } from "~/lib/types/marketingTeam";

interface MarketingTeamProps {
    countries: SelectCountry[];
}

// Component to display organization roles and members
export const MarketingTeams = ({countries}: MarketingTeamProps) => {
    const { organization, isLoaded } = useOrganization();
    const [members, setMembers] = useState<PartialClerkUser[]>([]); // Correct type for members
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [marketingTeams, setMarketingTeams] = useState<SelectMarketingTeam[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isMarketingTeamUpdated, setIsMarketingTeamUpdated] = useState<boolean>(false);

    useEffect(() => {
        const fetchMembers = async () => {
            if (organization) {
                try {
                    setIsLoading(true);

                    // const memberships = await organization.getMemberships();
                    const memberships:PartialClerkUser[] = await getAllClerkUsersByOrgId(organization.id);

                    console.log(memberships);

                    setMembers(memberships); // Set the 'items' array containing memberships

                    const marketingTeams = await getAllMarketingTeams(organization.id);
                    setMarketingTeams(marketingTeams);

                    console.log(memberships);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching members:", error);
                    setIsLoading(false);
                }
            }
        };

        fetchMembers();
    }, [organization, isMarketingTeamUpdated]);

    const handleAdd = () => {
        setIsAddModalOpen(true);
    }


    if (!organization) {
        return <div>
            <OrganizationSwitcher hidePersonal={true} hideSlug={true} />
        </div>;
    }

    const triggerFlag = () => {
        setIsMarketingTeamUpdated(!isMarketingTeamUpdated);
    }

    if (isLoading) {
        return (
            <div>
                <div className="flex flex-row border-b justify-between items-center py-2">
                <div className="items-center text-base font-bold">
                    Marketing Teams
                </div>
                <Button variant="primaryGreen" onClick={() => handleAdd()}>Add Team</Button>
            </div>
                
            <div className="mt-4">
                {marketingTeams && marketingTeams.length > 0 ? (
                    <div>
                        <div className="mb-2 text-[13px] font-medium">
                            Please select the marketing team and update their details
                        </div>
                        <MarketingTeamTable teams={marketingTeams} countries={countries} members={members} organization={organization} triggerRefetch={triggerFlag} isLoading={true}/>
                    </div>
                ) : (
                    <div className="text-[13px] font-medium">
                        Loading
                    </div>
                )}

            </div>
            </div>
            
        );
    }

    return (
        <div>
            <div className="flex flex-row border-b justify-between items-center py-2">
                <div className="items-center text-base font-bold">
                    Marketing Teams
                </div>
                <Button variant="primaryGreen" onClick={() => handleAdd()}>Add Team</Button>
            </div>

            <div className="mt-4">
                {marketingTeams && marketingTeams.length > 0 ? (
                    <div>
                        <div className="mb-2 text-[13px] font-medium">
                            Please select the marketing team and update their details
                        </div>
                        <MarketingTeamTable teams={marketingTeams} countries={countries} members={members} organization={organization} triggerRefetch={triggerFlag} isLoading={false}/>
                    </div>
                ) : (
                    <div className="text-[13px] font-medium">
                        No marketing teams found in this organization.
                    </div>
                )}

            </div>
            {/* Modal to edit team */}
            <AddMarketingTeamModal
                tenantId={organization.id}
                onClose={() => setIsAddModalOpen(false)}
                isOpen={isAddModalOpen}
                countries={countries}
                triggerRefetch={triggerFlag}
            />
        </div>
    );
};