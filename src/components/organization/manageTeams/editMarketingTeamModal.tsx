"use client"

import { useState } from "react";
import { SelectCountry, SelectMarketingTeam } from "~/server/db/schemaTypes";
import { Button } from "~/components/ui/button";
import { LoaderCircle } from "lucide-react";
import StatusNote from "~/components/common/statusNote";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { updateMarketingTeam } from "~/server/db/queries/marketingTeams";
import { toast } from "~/hooks/use-toast";


interface EditMarketingTeamModalProps {
    team: SelectMarketingTeam;
    onClose: () => void;
    isOpen: boolean;
    countries: SelectCountry[];
    teams: SelectMarketingTeam[];
    triggerRefetch: () => void;
  }
  
  // Modal to edit marketing team
  const EditMarketingTeamModal = ({ team, onClose, isOpen, countries, teams, triggerRefetch }: EditMarketingTeamModalProps) => {
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
  
    // Save team data
    const handleSave = async () => {
      if (!teamData) return; // If no team data, do nothing
  
      setIsSaving(true);
      try {
        const existingTeamName = teams.find((t) => t.name === teamData.name);

        if (existingTeamName) {
            toast({
                title: "Error updating team",
                description: "Team name already exists",
            });
            setIsSaving(false);
            return;
        }
        // Perform save operation here
        console.log("Team Data:", teamData);
        // Assuming the API call returns a response
        const response = await updateMarketingTeam(teamData);
        if (!response) {
          throw new Error("Failed to save team data");
        }

        setIsSaving(false);
        toast({
            title: "Team updated",
            description: "Team updated successfully",
        })
        setSuccessState(1);
        triggerRefetch();
      } catch (error) {
        setIsSaving(false);
        setSuccessState(0);
        toast({
            title: "Error updating team",
            description: "Failed to update team"
        });
      } finally {
        // Reset success state after 4 seconds
        setTimeout(() => {
          setSuccessState(2);
        }, 4000);
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
          <DialogHeader>
              <DialogTitle>Edit Marketing Team - {team.name}</DialogTitle>
              <DialogDescription>
                  Edit the marketing team details and click save
              </DialogDescription>
          </DialogHeader>
  
          <div className="p-0 mt-3">
                    <div className="space-y-6 text-[13px]">
                        <div className="flex flex-col items-start space-y-2">
                            <div className="text-base font-medium leading-none">
                                Name
                            </div>
                            <Input
                                id="name"
                                type="text"
                                value={teamData?.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="w-full"
                            />
                        </div>
                        {/* <div className="flex flex-col items-start space-y-2">
                            <div className="text-base font-medium leading-none">
                                Country
                            </div>
                            <Select
                                onValueChange={(value) => {
                                    setTeamData((prevData) => ({
                                        ...prevData,
                                        country: value,
                                    } as SelectMarketingTeam));
                                }}
                                value={teamData.country}
                            >
                                <SelectTrigger className="bg-slate-100 shadow-md">
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((country) => (
                                        <SelectItem
                                            key={country.id}
                                            value={country.name}
                                        >
                                            {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div> */}
                    </div>

                    {/* Save Button */}
                    <div className="mt-6 w-full flex flex-row justify-end">
                        <Button
                            onClick={handleSave}
                            variant={"primaryGreen"}
                            className="w-auto"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <div className="flex items-center justify-center">
                                    <LoaderCircle size={20} className="mr-2 animate-spin" />
                                    <span>Updating</span>
                                </div>
                            ) : "Update Team"}
                        </Button>
                    </div>
                    <div className="mt-3">
                        {/* Success note */}
                        {successState === 1 && (
                            <StatusNote
                                type="success"
                                title="Team updated"
                                message="Team updated successfully"
                            />
                        )}
                        {/* Error note */}
                        {successState === 0 && (
                            <StatusNote
                                type="error"
                                title="Error updating team"
                                message="Failed to update team"
                            />
                        )}
                    </div>
                </div>
                </DialogContent>
                </Dialog>
    );
  }

  export default EditMarketingTeamModal;