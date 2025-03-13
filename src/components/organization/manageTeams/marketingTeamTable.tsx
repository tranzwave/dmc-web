"use client"

import { useState } from "react";
import { SelectCountry, SelectMarketingTeam } from "~/server/db/schemaTypes";
import { Button } from "~/components/ui/button";
import EditMarketingTeamModal from "./editMarketingTeamModal";
import { DeleteIcon, PencilIcon, Trash2, Users2 } from "lucide-react";
import ManageTeamMembersModal from "./manageTeamMembersSheet";
import { OrganizationMembershipResource, OrganizationResource } from "@clerk/types";
import { PartialClerkUser } from "~/lib/types/marketingTeam";
import DeleteMarketingTeamModal from "./deleteTeamModal";

type MarketingTeamTableProps = {
  teams: SelectMarketingTeam[];
  countries: SelectCountry[];
  members: PartialClerkUser[];
  organization: OrganizationResource;
  triggerRefetch: () => void;
  isLoading: boolean
};

// Component to display marketing teams
export const MarketingTeamTable = ({ teams, countries, members, organization, triggerRefetch, isLoading }: MarketingTeamTableProps) => {
  const [error, setError] = useState<Error | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<SelectMarketingTeam | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isMemberEditModalOpen, setIsMemberEditModalOpen] = useState<boolean>(false);
  const [isTeamDeleteModalOpen, setIsTeamDeleteModalOpen] = useState<boolean>(false);

  const handleEdit = (team: SelectMarketingTeam) => {
    setSelectedTeam(team);
    setIsEditModalOpen(true);
  };

  const handleMemberEdit = (team: SelectMarketingTeam) => {
    setSelectedTeam(team);
    setIsMemberEditModalOpen(true);
  }

  const handleDelete = (team: SelectMarketingTeam) => {
    setSelectedTeam(team);
    setIsTeamDeleteModalOpen(true);
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-4xl">
      <table className="min-w-full rounded-lg border border-gray-200 bg-white shadow-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-[13px]">
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Name
            </th>
            {/* <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Country
            </th> */}
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Members
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index} className="border-b hover:bg-gray-50 text-[13px]">
              <td className="px-4 py-3 text-gray-700">
                {team.name}
              </td>
              {/* <td className="px-4 py-3 text-gray-700">
                {team.country}
              </td> */}
              <td className="px-4 py-3 text-gray-700">
                {members.filter((member) => member.publicMetadata?.teams?.some(t => t.teamId === team.id)).length}
              </td>
              <td className="px-4 py-3 text-gray-700 flex flex-row gap-2">
                <div
                  className="hover:cursor-pointer "
                  onClick={() => handleEdit(team)}
                >
                  <PencilIcon
                    size={20}
                    className="rounded-md border border-blue-500 p-1 hover:bg-gray-200 text-blue-500"
                  />
                </div>

                <div
                  className="hover:cursor-pointer"
                  onClick={() => handleMemberEdit(team)}
                >
                  <Users2
                    size={20}
                    className="rounded-md border border-primary-green p-1 hover:bg-gray-200 text-primary-green"
                  />
                </div>
                <div
                  className="hover:cursor-pointer"
                  onClick={() => handleDelete(team)}
                >
                  <Trash2
                    size={20}
                    className="rounded-md border border-red-500 p-1 hover:bg-gray-200 text-red-500"
                  // color="red"
                  />
                </div>
              </td>
            </tr>
          ))}

          {isLoading && (
            <tr className="animate-pulse bg-gray-100 dark:bg-gray-800">
              {Array.from({ length: 4 }).map((_, index) => (
                <td key={index} className="px-4 py-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </td>
              ))}
            </tr>

          )}
        </tbody>
      </table>
      {/* Modal to edit team */}
      {selectedTeam && (
        <div>
          <EditMarketingTeamModal
            team={selectedTeam}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTeam(null);
            }}
            isOpen={selectedTeam !== null && isEditModalOpen}
            countries={countries}
            teams={teams}
            triggerRefetch={triggerRefetch}
          />

          <ManageTeamMembersModal
            team={selectedTeam}
            onClose={() => {
              setIsMemberEditModalOpen(false);
              setSelectedTeam(null);
            }}
            isOpen={selectedTeam !== null && isMemberEditModalOpen}
            countries={countries}
            members={members}
            organizationId={organization.id}
            triggerRefetch={triggerRefetch}
          />

          <DeleteMarketingTeamModal
            team={selectedTeam}
            onClose={() => {
              setIsTeamDeleteModalOpen(false);
              setSelectedTeam(null);
            }}
            isOpen={selectedTeam !== null && isTeamDeleteModalOpen}
            countries={countries}
            triggerRefetch={triggerRefetch}
            tenantId={organization.id}
          />
        </div>
      )}
    </div>
  );
};