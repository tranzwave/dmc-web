"use client"

import { useState } from "react";
import { SelectCountry, SelectMarketingTeam } from "~/server/db/schemaTypes";
import { Button } from "~/components/ui/button";
import { LoaderCircle } from "lucide-react";
import StatusNote from "~/components/common/statusNote";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { addMarketingTeam, deleteMarketingTeam } from "~/server/db/queries/marketingTeams";
import { AlertDialogAction } from "~/components/ui/alert-dialog";
import { toast } from "~/hooks/use-toast";

interface DeleteMarketingTeamModalProps {
    tenantId: string;
    onClose: () => void;
    isOpen: boolean;
    countries: SelectCountry[]
    triggerRefetch: () => void;
    team: SelectMarketingTeam;
}

// Modal to edit marketing team
const DeleteMarketingTeamModal = ({ tenantId, onClose, isOpen, countries, triggerRefetch,team }: DeleteMarketingTeamModalProps) => {
    // const [teamData, setTeamData] = useState<SelectMarketingTeam | null>();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [successState, setSuccessState] = useState<0 | 1 | 2>(2);

    // Save team data
    const handleDelete = async () => {
        if (!team) return; // If no team data, do nothing

        setIsDeleting(true);
        try {
            const response = await deleteMarketingTeam(team.id)
            if (!response) {
                throw new Error("Failed to delete team data");
            }

            setIsDeleting(false);

            toast({
                title: "Team deleted successfully",
                description: "The team has been deleted successfully",
            })
            
        } catch (error) {
            setIsDeleting(false);
            setSuccessState(0);
            toast({
                title: "Failed to delete team",
                description: "Failed to delete the team",
            })
        } finally {
            // Reset success state after 4 seconds
            setTimeout(() => {
                onClose();
                triggerRefetch();

            }, 1000);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Marketing Team - {team.name}</DialogTitle>
                    <DialogDescription>
                        Delete the marketing team details and click save
                    </DialogDescription>
                </DialogHeader>
                {/* Ask user whether he is sure about this deletion */}
                <div className="flex flex-col gap-4">
                    <div className="text-[13px]">
                        This will delete the marketing team and all its booking data. Are you sure you want to delete this team?
                    </div>
                    <div className="flex flex-row w-full justify-end items-center gap-2">
                    <Button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        variant="destructive"
                    >
                        {isDeleting ? (
                            <div className="flex flex-row gap-2 items-center">
                                <LoaderCircle className="animate-spin" size={20} />
                                <div>Deleting</div>
                            </div>
                            
                        ) : (
                            "Delete"
                        )}
                    </Button>
                    <Button variant={"default"} onClick={onClose}>
                        Cancel
                    </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteMarketingTeamModal;