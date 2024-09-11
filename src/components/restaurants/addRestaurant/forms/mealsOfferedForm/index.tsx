import { useState } from "react";
import { useAddRestaurant } from "~/app/dashboard/restaurants/add/context";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import { InsertMeal } from "~/server/db/schemaTypes";
import { columns } from "./columns";
import MealsOfferedForm from "./mealsOfferedForm";

const MealsOfferedTab = ()=>{
    const [addedMealsOffered, setAddedMealsOffered] = useState<InsertMeal[]>([]); // State to handle added activities
    const { addMeals, restaurantDetails } = useAddRestaurant(); // Assuming similar context structure for activities

    const updateMealsOffered = (meal: InsertMeal) => {
        console.log("Adding Meals Offered");
        addMeals(meal);
        setAddedMealsOffered((prevMealsOffered) => [...prevMealsOffered, meal]); // Update local state
    };
    
    return(
        <div className="flex flex-col gap-3 w-full justify-center items-center">
            <div className='w-full flex flex-row gap-2 justify-center'>
                <div className='card w-[90%] space-y-6'>
                <div className='card-title'>Meals Offered Information</div>
                <MealsOfferedForm onAddMeal={updateMealsOffered} />
                </div>
            </div>

            <div className='flex flex-col gap-2 items-center justify-center w-[90%]'>
                <div className='w-full'>
                    <DataTable columns={columns} data={restaurantDetails.mealsOffered} />
                </div>
                <div className="w-full flex justify-end">
                    <Button variant={"primaryGreen"}>Next</Button>
                </div>
            </div>
        </div>
    )
}

export default MealsOfferedTab;