"use client"
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
// import  RestaurantData from "~/app/dashboard/restaurants/[id]/edit/page";
import { useAddRestaurant } from "~/app/dashboard/restaurants/add/context";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { updateRestaurantAndRelatedData } from "~/server/db/queries/restaurants";
import { InsertMeal, InsertRestaurant } from "~/server/db/schemaTypes";

const EditRestaurantSubmitForm = ({id,originalDriverData}:{id:string,originalDriverData:any | null}) => {
    const { restaurantDetails } = useAddRestaurant();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const { general, mealsOffered, } = restaurantDetails;
    const router = useRouter()

    const updateRestaurant = async () => {
        console.log({
          general,
          mealsOffered
        });
        const restaurantData:InsertRestaurant[] = [{
            name: general.name,
            contactNumber: general.contactNumber,
            streetName: general.streetName,
            province: general.province,
            tenantId: "",
            cityId: Number(general.city?.id),
            createdAt:originalDriverData?.createdAt ?? new Date(),
            id: originalDriverData?.id ?? ""
        }]
        
        const mealData:InsertMeal[] = mealsOffered.map((m) => {
            return {
                mealType: m.mealType,
                startTime: m.startTime,
                endTime:m.endTime
            }
        })
      
        try {
          // Replace insertDriver with your function to handle the insertion of driver details
          const response = await updateRestaurantAndRelatedData(
            id,
            restaurantData[0] ?? null,
            mealData,
          );
      
          if (!response) {
            throw new Error(`Error: Failed to insert restaurant`);
          }
      
          console.log("Success:", response);
      
          setLoading(false);
          // Handle successful response (e.g., show a success message)
          toast({
            title: "Success",
            description: "Restaurant updated successfully",
          });
          router.push("/dashboard/restaurants")
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
            description: "Error while adding the restaurant",
          });
        } finally {
          setLoading(false);
        }
      };
      

    return (
        <div>
            {/* General Section */}
            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>General</div>
            </div>
            <div className="border rounded-lg mb-2 shadow-md">
                <table className="min-w-full text-xs">
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2 font-bold w-1/2 ">Name:</td>
                            <td className="border px-4 py-2 w-1/2 ">{general.name}</td>
                        </tr>
        
                        <tr>
                            <td className="border px-4 py-2 font-bold">Contact Number:</td>
                            <td className="border px-4 py-2">{general.contactNumber}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Street Name:</td>
                            <td className="border px-4 py-2">{general.streetName}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">City:</td>
                            <td className="border px-4 py-2">{general.city?.name}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Province:</td>
                            <td className="border px-4 py-2">{general.province}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Vehicles Section */}
            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>Vehicles</div>
            </div>
            <div className="border rounded-lg mb-2 shadow-md">
                <table className="min-w-full text-xs">
                    <tbody>
                        {mealsOffered.length > 0 ? (
                            mealsOffered.map((meal, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <th className=" px-4 py-2 text-primary-green bg-secondary-green text-sm  font-bold" colSpan={2}>Vehicle {index + 1}</th>
                                    </tr>
                                    <tr className="grid-cols-2">
                                        <td className="border px-4 py-2 font-bold w-1/2 ">Meal Type:</td>
                                        <td className="border px-4 py-2 w-1/2 ">{meal.mealType}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 font-bold">Start Time:</td>
                                        <td className="border px-4 py-2">{meal.startTime}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 font-bold">End Time:</td>
                                        <td className="border px-4 py-2">{meal.endTime}</td>
                                    </tr>
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td className="border px-4 py-2" colSpan={2}>No vehicles added</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Submit Button */}
            <div className="flex w-full justify-center mt-4">
                <Button variant="primaryGreen" onClick={updateRestaurant} disabled={loading}>
                    {loading ? <LoaderCircle className="animate-spin"/> : 'Submit'}
                </Button>
            </div>
        </div>
    );
}

export default EditRestaurantSubmitForm;
