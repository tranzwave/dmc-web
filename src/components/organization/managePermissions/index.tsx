"use client"
import { useOrganization } from "@clerk/nextjs";
import { OrganizationMembershipResource } from "@clerk/types";
import { useEffect, useState } from "react";

// Component to display organization roles and members
export const OrganizationRolesAndPermissions = () => {
    const { organization, isLoaded } = useOrganization();
    const [members, setMembers] = useState<OrganizationMembershipResource[]>([]); // Correct type for members
    const [isLoading, setIsLoading] = useState<boolean>(false);
  
    useEffect(() => {
      const fetchMembers = async () => {
        if (organization) {
          try {
            setIsLoading(true);
            const memberships = await organization.getMemberships();
            setMembers(memberships.data); // Set the 'items' array containing memberships
            setIsLoading(false);
          } catch (error) {
            console.error("Error fetching members:", error);
            setIsLoading(false);
          }
        }
      };
  
      fetchMembers();
    }, [organization]);
  
    if (!organization) {
      return <div>No organization selected</div>;
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
        <div className="items-center border-b pb-4 text-base font-bold">
          Roles & Permissions
        </div>
        <div className="mt-4">
          {members.length > 0 ? (
            <div>
              <div className="mb-2 text-[13px] font-medium">
                Please select the member and update their permissions
              </div>
              <ul>
                {members.map((member) => (
                  <li
                    key={member.publicUserData.userId}
                    className="flex items-center justify-between p-2"
                  >
                    <span>
                      {member.publicUserData.firstName}{" "}
                      {member.publicUserData.lastName}
                    </span>
                    <span className="text-sm text-gray-500">{member.role}</span>
                  </li>
                ))}
              </ul>
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