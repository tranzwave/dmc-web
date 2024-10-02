"use client"
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import  RestaurantData from "~/app/dashboard/restaurants/[id]/edit/page";
import { useAddActivity } from "~/app/dashboard/activities/add/context";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { updateRestaurantAndRelatedData as updateActivityAndRelatedData } from "~/server/db/queries/activities";
import { InsertActivity, InsertActivityVendor } from "~/server/db/schemaTypes";
import { columns } from "../activityForm/columns";

const EditActivitySubmitForm = ({id,originalActivityVendorData}:{id:string,originalActivityVendorData:any | null}) => {
    const { activityVendorDetails } = useAddActivity();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const { general, activities, } = activityVendorDetails;
    const router = useRouter()

    const updateActivityVendor = async () => {
        console.log({
          general,
          activities
        });
        const activityVendorData:InsertActivityVendor[] = [{
            name: general.name,
            contactNumber: general.contactNumber,
            streetName: general.streetName,
            province: general.province,
            tenantId: "",
            cityId: Number(general.city?.id),
            createdAt:originalActivityVendorData?.createdAt ?? new Date(),
            id: originalActivityVendorData?.id ?? ""
        }]
        
        const activity:InsertActivity[] = activities.map((a) => {
            return {
                name: a.name,
                activityType: a.activityType,
                capacity:a.capacity,
                tenantId:"",
                activityVendorId:""
            }
        })
      
        try {
          // Replace insertDriver with your function to handle the insertion of driver details
          const response = await updateActivityAndRelatedData(
            id,
            activityVendorData[0] ?? null,
            activity,
          );
      
          if (!response) {
            throw new Error(`Error: Failed to insert activity vendor`);
          }
      
          console.log("Success:", response);
      
          setLoading(false);
          // Handle successful response (e.g., show a success message)
          toast({
            title: "Success",
            description: "Activity vendor updated successfully",
          });
          router.push("/dashboard/activities")
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("An unknown error occurred");
          }
          console.error("Error:", error);
          alert(error)
          setLoading(false);
          toast({
            title: "Uh Oh!",
            description: "Error while adding the activity vendor",
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
                            <td className="border px-4 py-2">{activityVendorDetails.general.city?.name}</td>
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
                <Button variant="primaryGreen" onClick={updateActivityVendor} disabled={loading}>
                    {loading && (<LoaderCircle className="animate-spin" size={18}/>)} Submit
                </Button>
            </div>
        </div>
    );
}

export default EditActivitySubmitForm;
