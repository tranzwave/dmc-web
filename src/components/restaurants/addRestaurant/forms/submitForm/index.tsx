import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAddRestaurant } from "~/app/dashboard/restaurants/add/context";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { insertRestaurant } from "~/server/db/queries/restaurants";
import { columns } from "../mealsOfferedForm/columns";

const SubmitForm = () => {
    const { restaurantDetails } = useAddRestaurant();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast()
    const router = useRouter()
    const pathname = usePathname()

    const handleSubmit = async () => {
        console.log('Submitting restaurant details:', restaurantDetails);
        setLoading(true)

        try {
            let response;
            // Replace insertActivity with your function to handle the insertion of activity details
            if(pathname.includes("/edit")){
                setLoading(false)
                alert("Updated")
                return
            } else{
                response = await insertRestaurant([restaurantDetails]);
            }        
            if (!response) {
              throw new Error(`Error: Inserting Restaurant`);
            }
        
            console.log("Success:", response);
        
            setLoading(false);
            // Handle successful response (e.g., show a success message)
            toast({
              title: "Success",
              description: "Restaurant added successfully",
            });
            router.push("/dashboard/restaurants")
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
              description: "Error while adding the restaurant",
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
                            <td className="border px-4 py-2 w-1/2">{restaurantDetails.general.name}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Street Name:</td>
                            <td className="border px-4 py-2">{restaurantDetails.general.streetName}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">City:</td>
                            <td className="border px-4 py-2">{restaurantDetails.general.cityId}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Province:</td>
                            <td className="border px-4 py-2">{restaurantDetails.general.province}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Contact Nummber:</td>
                            <td className="border px-4 py-2">{restaurantDetails.general.contactNumber}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>Meals Offered</div>
            </div>

            <div className="border rounded-lg mb-2 shadow-md">
            <DataTable columns={columns} data={restaurantDetails.mealsOffered} /> {/* Displaying activities */}
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
