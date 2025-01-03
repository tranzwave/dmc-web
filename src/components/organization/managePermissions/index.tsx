"use client";
import { User } from "@clerk/backend";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { OrganizationMembershipResource } from "@clerk/types";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { permissionsList } from "~/lib/constants";
import { Permissions } from "~/lib/types/global";

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
          console.log(memberships);
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
        {/* <OrganizationSwitcher
          defaultOpen={true}
          hidePersonal={true}
          appearance={{
            elements: {
              organizationSwitcherPopoverActionButton__createOrganization:
                "hidden",
            },
          }}
        /> */}
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

type UserTableProps = {
  members: OrganizationMembershipResource[];
};
const UserTable = ({ members }: UserTableProps) => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [userData, setUserData] = useState<User | null>();
  const [error, setError] = useState(null);

  const fetchUserData = async (userId: string) => {
    if (!userId) return; // If no userId, do nothing

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      console.log(data.result);
      setUserData(data.result.user); // Assuming the API returns a user object in `data.user`
    } catch (err: any) {
      setError(err.message); // Handle errors
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    // setUserId(id); // Set user ID to trigger the query
    fetchUserData(id);
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-4xl">
      <table className="min-w-full rounded-lg border border-gray-200 bg-white shadow-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              User
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Joined
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Role
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="flex items-center space-x-4 px-4 py-3">
                <img
                  src={member.publicUserData.imageUrl}
                  alt={member.publicUserData.firstName ?? ""}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    {member.publicUserData.firstName +
                      " " +
                      member.publicUserData.lastName}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {member.createdAt.toISOString().split("T")[0]}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                {member.role.split(":")[1]}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                <Sheet>
                  <SheetTrigger>
                    <div
                      className="hover:bg-gray-200"
                      onClick={() =>
                        handleEdit(member.publicUserData.userId ?? "")
                      } // Pass the member ID to handleEdit
                    >
                      <PencilIcon
                        size={20}
                        className="rounded-md border border-zinc-400 p-1"
                      />
                    </div>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit Permissions</SheetTitle>
                      <SheetDescription>
                        Please select the necessary permissions from the below
                        list and click save
                      </SheetDescription>
                    </SheetHeader>

                    {isLoading && <div>Loading user details...</div>}
                    {error && <div>Error fetching user details</div>}
                    {!isLoading && userData && (
                      <div>
                        {/* Render other user details as needed */}
                        <div className="flex items-center gap-2">
                          <img
                            src={member.publicUserData.imageUrl}
                            alt={member.publicUserData.firstName ?? ""}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <div className="mt-3 text-sm font-medium text-gray-700">
                              {member.publicUserData.firstName +
                                " " +
                                member.publicUserData.lastName}
                            </div>
                            <div className="mb-3 text-xs font-medium text-gray-700">
                              {userData.primaryEmailAddress?.emailAddress ??
                                userData.emailAddresses[0]?.emailAddress}
                            </div>
                          </div>
                        </div>
                        <CheckboxList
                          assignedPermissions={
                            (userData.publicMetadata.permissions as string[]) ??
                            []
                          }
                          permissions={permissionsList}
                        />
                      </div>
                    )}
                  </SheetContent>
                </Sheet>

                <div className="flex w-full items-center justify-center"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface CheckboxListProps {
  assignedPermissions: string[];
  permissions: string[]; // Permissions list to set default checked values
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  assignedPermissions,
  permissions,
}) => {
  // Set default values based on permissions
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Populate selected values based on permissions initially
  useEffect(() => {
    const defaultChecked = assignedPermissions.filter((option) =>
      permissions.includes(option),
    );
    setSelectedValues(defaultChecked);
  }, [assignedPermissions, permissions]);

  // Toggle selected value on checkbox click
  const handleCheckboxChange = (value: string) => {
    setSelectedValues(
      (prevSelected) =>
        prevSelected.includes(value)
          ? prevSelected.filter((item) => item !== value) // Remove if already selected
          : [...prevSelected, value], // Add if not selected
    );
  };

  // Action to perform on save
  const handleSave = () => {
    console.log("Selected Values: ", selectedValues);
    // Perform additional actions here, such as making an API call or state update
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        {permissions.map((option) => {
          if(option.includes("sys")){
            return ''
          }
          return(
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={selectedValues.includes(option)} // Check if selected
              onCheckedChange={() => handleCheckboxChange(option)}
            />
            <label
              htmlFor={option}
              className="text-base font-medium leading-none"
            >
              {option}
            </label>
          </div>
        )})}
      </div>

      {/* Save Button */}
      <div className="mt-4 w-full">
        <Button
          onClick={handleSave}
          variant={"primaryGreen"}
          className="w-full"
        >
          Save Permissions
        </Button>
      </div>
    </div>
  );
};
