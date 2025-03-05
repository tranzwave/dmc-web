"use client"

import { useEffect, useState } from "react";
import { SelectCountry, SelectMarketingTeam } from "~/server/db/schemaTypes";
import { Button } from "~/components/ui/button";
import { LoaderCircle } from "lucide-react";
import StatusNote from "~/components/common/statusNote";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { OrganizationMembershipResource } from "@clerk/types";
import { Checkbox } from "~/components/ui/checkbox";
import { ClerkUserPublicMetadata } from "~/lib/types/payment";
import { getUserPublicMetadata, updateBulkUsersTeams } from "~/server/auth";
import { toast } from "~/hooks/use-toast";
import { set } from "date-fns";
import { PartialClerkUser } from "~/lib/types/marketingTeam";


interface EditMarketingTeamModalProps {
    team: SelectMarketingTeam;
    onClose: () => void;
    isOpen: boolean;
    countries: SelectCountry[];
    members: PartialClerkUser[];
    organizationId: string;
    triggerRefetch: () => void;
}

// Modal to edit marketing team
const ManageTeamMembersModal = ({ team, onClose, isOpen, countries, members, organizationId,triggerRefetch }: EditMarketingTeamModalProps) => {
    const [teamData, setTeamData] = useState<SelectMarketingTeam>(team);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [successState, setSuccessState] = useState<0 | 1 | 2>(2);

    // Update team data on change
    const handleChange = (key: string, value: string) => {
        setTeamData((prevData) => ({
            ...prevData,
            [key]: value,
        } as SelectMarketingTeam));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Team Members- {team.name}</DialogTitle>
                    <DialogDescription>
                        Manage marketing team members and assign roles
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Tabs defaultValue={'rolesAndPermissions'} className='w-full h-[97%] pb-4'>
                        <TabsList className='flex w-full justify-evenly'>
                            <TabsTrigger value='managers'>Managers</TabsTrigger>
                            <TabsTrigger value='members'>Members</TabsTrigger>
                        </TabsList>
                        <TabsContent value='managers'>
                            <MembersListWithCheckboxes members={members} roleToCheck='manager' marketingTeam={team} organizationId={organizationId} triggerRefetch={triggerRefetch}/>
                        </TabsContent>
                        <TabsContent value='members'>
                            <MembersListWithCheckboxes members={members} roleToCheck='member' marketingTeam={team} organizationId={organizationId} triggerRefetch={triggerRefetch}/>
                        </TabsContent>
                    </Tabs>
                </div>

            </DialogContent>
        </Dialog>
    );
}

interface MembersListWithCheckboxesProps {
    members: PartialClerkUser[];
    roleToCheck: 'member' | 'manager';
    marketingTeam: SelectMarketingTeam;
    organizationId: string;
    triggerRefetch: () => void;
}


const MembersListWithCheckboxes = ({ members, roleToCheck, marketingTeam, organizationId, triggerRefetch }: MembersListWithCheckboxesProps) => {

    const [membersWithRoleToCheck, setMembersWithRoleToCheck] = useState<{ role: string, members: string[] }>({
        role: roleToCheck,
        members: []
    });

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!members.length) return;
    
        const fetchMembersWithRole = async () => {
            setIsLoading(true);
            const filteredMembers = members.filter((member) => member.publicMetadata?.teams?.some((team) => team.teamId === marketingTeam.id && team.role === roleToCheck));
            setMembersWithRoleToCheck((prev) => ({
                ...prev,
                members: filteredMembers.map((member) => member.id),
            }));
            setIsLoading(false);
        };
    
        fetchMembersWithRole();
    }, [members, roleToCheck, marketingTeam.id]);
    

    const handleCheckboxChange = (memberId: string) => {
        if (memberId === '') return;
        if (membersWithRoleToCheck.members.includes(memberId)) {
            setMembersWithRoleToCheck((prev) => ({
                ...prev,
                members: prev.members.filter((id) => id !== memberId),
            }));
        } else {
            setMembersWithRoleToCheck((prev) => ({
                ...prev,
                members: [...prev.members, memberId],
            }));
        }
    }

    const handleSave = async () => {
        try {
            setIsSaving(true);
            console.log("Saving team members");
            console.log("membersWithRoleToCheck", membersWithRoleToCheck);

            const response = await updateBulkUsersTeams(organizationId, marketingTeam.id, membersWithRoleToCheck);

            if (response) {
                setIsSaving(false);
                toast({
                    title: 'Success',
                    description: 'Team members updated successfully',
                })
            }

            triggerRefetch();

        } catch (error) {
            console.error("Error updating team members:", error);
            toast({
                title: 'Error',
                description: 'An error occurred while updating team members',
            })
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-row items-center justify-center h-full">
                <LoaderCircle size={20} className="animate-spin" />
            </div>
        );
    }

    return (
        <div className='w-full h-full flex flex-col gap-4'>
            <div className="h-full flex flex-col gap-2 max-h-[600px] overflow-y-auto">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2 text-[13px]">
                        <Checkbox
                            id={member.id}
                            checked={membersWithRoleToCheck.members.includes(member.id)} // Check if selected
                            onCheckedChange={() => handleCheckboxChange(member.id)}
                        />
                        <label
                            htmlFor={member.id}
                            className="text-base font-medium leading-none"
                        >
                            {member.fullName}
                        </label>
                    </div>
                ))}
            </div>

            <div>
                <Button variant={"primaryGreen"} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <div className="flex flex-row items-center gap-2">
                            <LoaderCircle size={20} className="mr-2 animate-spin" />
                            <div>Saving</div>
                        </div>
                    ) : (
                        "Save"
                    )}
                </Button>
            </div>
        </div>
    );
}

export default ManageTeamMembersModal;