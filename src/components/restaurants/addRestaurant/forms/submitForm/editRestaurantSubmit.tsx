"use client"
import { useOrganization } from "@clerk/nextjs";
import { set } from "date-fns";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
// import  RestaurantData from "~/app/dashboard/restaurants/[id]/edit/page";
import { useAddRestaurant } from "~/app/dashboard/restaurants/add/context";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { updateRestaurantAndRelatedData } from "~/server/db/queries/restaurants";
import { InsertMeal, InsertRestaurant } from "~/server/db/schemaTypes";

const EditRestaurantSubmitForm = ({id,originalRestaurant}:{id:string,originalRestaurant:any | null}) => {
    const { restaurantDetails } = useAddRestaurant();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const { general, mealsOffered, } = restaurantDetails;
    const router = useRouter()
    const {organization, isLoaded} = useOrganization();

    const updateRestaurant = async () => {
        console.log({
          general,
          mealsOffered
        });
      
        try {
            setLoading(true);
            if(!organization || !isLoaded){
                throw new Error("Organization not found");
            }

            const restaurantData:InsertRestaurant = {
                name: general.name,
                contactNumber: general.contactNumber,
                streetName: general.streetName,
                province: general.province,
                tenantId: organization.id,
                cityId: general.city?.id ? Number(general.city?.id) : (() => { throw new Error("City ID not found") })(),
                createdAt:originalRestaurant?.createdAt ?? new Date(),
                id: id ?? (() => { throw new Error("Restaurant ID not found") })(),
                primaryEmail: restaurantDetails.general.primaryEmail,
            }
            
            const mealData:InsertMeal[] = mealsOffered.map((m) => {
                return {
                    mealType: m.mealType,
                    startTime: m.startTime,
                    endTime:m.endTime,
                    restaurantId: id ?? (() => { throw new Error("Restaurant ID not found") })(),
                    id: m.id !== "" || m.id !== null ? m.id : undefined
                }
            })
          // Replace insertDriver with your function to handle the insertion of driver details
          const response = await updateRestaurantAndRelatedData(
            id,
            restaurantData,
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
          setLoading(false);
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

            {/* Meal Offered Section */}
            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>Meal Offered</div>
            </div>
            <div className="border rounded-lg mb-2 shadow-md">
                <table className="min-w-full text-xs">
                    <tbody>
                        {mealsOffered.length > 0 ? (
                            mealsOffered.map((meal, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <th className=" px-4 py-2 text-primary-green bg-secondary-green text-sm  font-bold" colSpan={2}>Meal Offered {index + 1}</th>
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
                                <td className="border px-4 py-2" colSpan={2}>No meal offered added</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Submit Button */}
            <div className="flex w-full justify-center mt-4">
                <Button variant="primaryGreen" onClick={updateRestaurant} disabled={loading}>
                    {loading ? <div className="flex flex-row items-center"><LoaderCircle className="animate-spin" size={20}/><div>Saving</div></div> : 'Submit'}
                </Button>
            </div>
        </div>
    );
}

export default EditRestaurantSubmitForm;
