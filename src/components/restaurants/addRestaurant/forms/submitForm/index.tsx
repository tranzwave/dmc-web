import { useState } from "react";
import { useAddRestaurant } from "~/app/dashboard/restaurants/add/context";
import { Button } from "~/components/ui/button";
import { saveRestaurant } from "~/server/db/queries/restaurants";

const SubmitForm = () => {
    const { restaurantDetails } = useAddRestaurant();

    const { general } = restaurantDetails;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    

    const handleSubmit = async () => {
        console.log('Submitting restaurant details:', restaurantDetails);
        setLoading(true);
        setError(null);

        try {
            const restaurantData = {
                name: general.name,
                streetName: general.streetName,
                cityId: general.cityId, // Assuming you have a way to get the cityId
                tenantId: general.tenantId, // Assuming tenantId is available in your context or form data
                province: general.province,
                primaryContactNumber: general.primaryContactNumber,
                mealType: general.mealType,
                startTime: general.startTime,
                endTime: general.endTime,
            };

            // Call the server-side function to save the restaurant data
            await saveRestaurant(restaurantData);
            console.log("Restaurant saved successfully!");

        } catch (err) {
            console.error("Failed to save restaurant:", err);
            setError("Failed to save restaurant. Please try again.");
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
                            <td className="border px-4 py-2 w-1/2">{general.name}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Meal Type:</td>
                            <td className="border px-4 py-2">{general.mealType}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Start Time:</td>
                            <td className="border px-4 py-2">{general.startTime}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">End Time:</td>
                            <td className="border px-4 py-2">{general.endTime}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Street Name:</td>
                            <td className="border px-4 py-2">{general.streetName}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">City:</td>
                            <td className="border px-4 py-2">{general.cityId}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Province:</td>
                            <td className="border px-4 py-2">{general.province}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Contact Nummber:</td>
                            <td className="border px-4 py-2">{general.primaryContactNumber}</td>
                        </tr>
                    </tbody>
                </table>
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
