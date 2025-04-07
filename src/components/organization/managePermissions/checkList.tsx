"use client";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import StatusNote from "~/components/common/statusNote";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { toast } from "~/hooks/use-toast";
import { Permissions } from "~/lib/types/global";
import { updateUserPermissions } from "~/server/auth";

interface CheckboxListProps {
    assignedPermissions: string[];
    permissions: string[]; // Permissions list to set default checked values
    userId: string;
  }
  
  const CheckboxList: React.FC<CheckboxListProps> = ({
    assignedPermissions,
    permissions,
    userId,
  }) => {
    // Set default values based on permissions
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [successState, setSuccessState] = useState<0 | 1 | 2>(2);
  
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
    const handleSave = async() => {
      console.log("Selected Values: ", selectedValues);
  
      // Perform additional actions here, such as making an API call or state update
      try {
        setIsSaving(true);
        const response = await updateUserPermissions(userId, selectedValues as Permissions[]);
        console.log(response);
        
        if(response){
          setIsSaving(false);
          toast({
            title: "Success",
            description: "Permissions updated successfully",
          })
          setSuccessState(1);
        }
  
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update permissions",
        })
        setSuccessState(0);
      } finally {
        setIsSaving(false);
        // Reset success state after 4 seconds
        setTimeout(() => {
          setSuccessState(2);
        }, 4000);
      }
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
                {option.replace("booking_", "dashboard_")}
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
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center justify-center">
                <LoaderCircle size={20} className="mr-2 animate-spin" />
                <span>Saving</span>
              </div>
            ) : "Save Permissions"}
          </Button>
        </div>
        <div className="mt-3">
        {/* Success note */}
        {successState === 1 && (
          <StatusNote
            type="success"
            title="Permissions updated"
            message="Permissions updated successfully"
          />
        )}
        {/* Error note */}
        {successState === 0 && (
          <StatusNote
            type="error"
            title="Error updating permissions"
            message="Failed to update permissions"
          />
        )}
        </div>
  
      </div>
    );
  };

  export default CheckboxList;