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
            console.log(memberships)
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
              <div>{members[0]?.publicMetadata?.permissions as string}</div>
              <UserTable/>
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


  const UserTable = () => {
    const users = [
      {
        logo: '/images/pixabic-logo.png',
        name: 'Pixabic Designs',
        email: 'pixabic@gmail.com',
        joinDate: '9/26/2024',
        role: 'Member',
      },
      {
        logo: '/images/yasith-logo.png',
        name: 'Yasith Fernando',
        email: 'iyfernando42@gmail.com',
        joinDate: '9/12/2024',
        role: 'Admin',
      },
    ]
  
    return (
      <div className="w-full max-w-4xl mx-auto mt-10">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4 text-left font-semibold text-sm text-gray-600">User</th>
              <th className="py-3 px-4 text-left font-semibold text-sm text-gray-600">Joined</th>
              <th className="py-3 px-4 text-left font-semibold text-sm text-gray-600">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center space-x-4">
                  <img src={user.logo} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{user.joinDate}</td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-700">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
