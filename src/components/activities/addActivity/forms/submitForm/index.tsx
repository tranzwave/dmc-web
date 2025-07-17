"use client"
import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAddActivity } from "~/app/dashboard/activities/add/context";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { insertActivityVendor } from "~/server/db/queries/activities";
import { columns } from "../activityForm/columns";
import { useOrganization } from "@clerk/nextjs";

const SubmitForm = () => {
    const { activityVendorDetails } = useAddActivity();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const router = useRouter()
    const pathname = usePathname()
    const {organization, isLoaded} = useOrganization()

    const handleSubmit = async() => {

        // Handle the submission of activityDetails
        console.log('Submitting activity details:', activityVendorDetails);
        setLoading(true)
        try {
            if(!organization){
                throw new Error("Organization not found")
            }
            let response;
            // Replace insertActivity with your function to handle the insertion of activity details
            if(pathname.includes("/edit")){
                setLoading(false)
                alert("Updated")
                return
            } else{
                response = await insertActivityVendor([activityVendorDetails], organization.id);
            }
        
            if (!response) {
              throw new Error(`Error: Inserting Activity Vendor`);
            }
        
            console.log("Success:", response);
        
            setLoading(false);
            // Handle successful response (e.g., show a success message)
            toast({
              title: "Success",
              description: "Activity added successfully",
            });
            router.push("/dashboard/activities");
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
                        {/* <tr>
                            <td className="border px-4 py-2 font-bold">Street Name:</td>
                            <td className="border px-4 py-2">{activityVendorDetails.general.streetName}</td>
                        </tr> */}
                        <tr>
                            <td className="border px-4 py-2 font-bold">Located City:</td>
                            <td className="border px-4 py-2">{activityVendorDetails.general.city?.name}</td>
                        </tr>
                        {/* <tr>
                            <td className="border px-4 py-2 font-bold">Province:</td>
                            <td className="border px-4 py-2">{activityVendorDetails.general.province}</td>
                        </tr> */}
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
                <Button variant="primaryGreen" onClick={handleSubmit} disabled={loading}>
                    {loading && (<LoaderCircle className="animate-spin" size={18}/>)} Submit
                </Button>
            </div>
        </div>
    );
}

export default SubmitForm;
