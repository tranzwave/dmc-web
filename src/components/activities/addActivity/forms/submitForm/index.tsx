"use client"
import { useAddActivity } from "~/app/dashboard/activities/add/context";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import { columns } from "../activityForm/columns";
import { insertActivityVendor } from "~/server/db/queries/activities";
import { useState } from "react";
import { useToast } from "~/hooks/use-toast";

const SubmitForm = () => {
    const { activityVendorDetails } = useAddActivity();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()


    const handleSubmit = async() => {
        // Handle the submission of activityDetails
        console.log('Submitting activity details:', activityVendorDetails);

        try {
            // Replace insertDriver with your function to handle the insertion of driver details
            const response = await insertActivityVendor([activityVendorDetails]);
        
            if (!response) {
              throw new Error(`Error: Inserting Activity Vendor`);
            }
        
            console.log("Success:", response);
        
            setLoading(false);
            // Handle successful response (e.g., show a success message)
            toast({
              title: "Success",
              description: "Driver added successfully",
            });
          } catch (error) {
            if (error instanceof Error) {
              setError(error.message);
            } else {
              setError("An unknown error occurred");
            }
            console.error("Error:", error);
            setLoading(false);
            toast({
              title: "Uh Oh!",
              description: "Error while adding the driver",
            });
          } finally {
            setLoading(false);
          }
    };

    return (
        <div>
            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>General</div>
            </div>
            
            <div className="border rounded-lg mb-2 shadow-md">
                <table className="min-w-full text-xs">
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2 font-bold w-1/2">Name:</td>
                            <td className="border px-4 py-2 w-1/2">{activityVendorDetails.general.name}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Contact Number</td>
                            <td className="border px-4 py-2">{activityVendorDetails.general.contactNumber}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Contact Number:</td>
                            <td className="border px-4 py-2">{activityVendorDetails.general.contactNumber}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Street Name:</td>
                            <td className="border px-4 py-2">{activityVendorDetails.general.streetName}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">City:</td>
                            <td className="border px-4 py-2">{activityVendorDetails.general.city}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Province:</td>
                            <td className="border px-4 py-2">{activityVendorDetails.general.province}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>Activities</div>
            </div>

            <div className="border rounded-lg mb-2 shadow-md">
            <DataTable columns={columns} data={activityVendorDetails.activities} /> {/* Displaying activities */}

            </div>

            <div className="flex w-full justify-center mt-4">
                <Button variant="primaryGreen" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </div>
    );
}

export default SubmitForm;
