"use client";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { OrganizationMembershipResource } from "@clerk/types";
import { useEffect, useState } from "react";
import { SelectMarketingTeam } from "~/server/db/schemaTypes";
import { getAllMarketingTeams } from "~/server/db/queries/marketingTeams";
import UserTable from "./userTable";

// Component to display organization roles and members
export const OrganizationRolesAndPermissions = () => {
  const { organization, isLoaded } = useOrganization();
  const [members, setMembers] = useState<OrganizationMembershipResource[]>([]); // Correct type for members
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [marketingTeams, setMarketingTeams] = useState<SelectMarketingTeam[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (organization) {
        try {
          setIsLoading(true);
          const memberships = await organization.getMemberships();
          setMembers(memberships.data); // Set the 'items' array containing memberships

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
  }, []);

  if (!organization) {
    return <div>
      <OrganizationSwitcher hidePersonal={true} hideSlug={true} />
    </div>;
  }

  if (isLoading) {
    return (
      <div>
        <div className="items-center border-b pb-4 text-base font-bold">
          Roles & Permissions
        </div>
        <div className="mt-4">Loading</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="items-center border-b pb-4 text-base font-bold">
          Roles & Permissions
        </div>
      </div>

      <div className="mt-4">
        {members.length > 0 ? (
          <div>
            <div className="mb-2 text-[13px] font-medium">
              Please select the member and update their permissions
            </div>
            <UserTable members={members} />
          </div>
        ) : (
          <div className="text-[13px] font-medium">
            No members found in this organization.
          </div>
        )}
      </div>
    </div>
  );
};