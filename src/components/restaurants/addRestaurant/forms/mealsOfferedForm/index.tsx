import { useState } from "react";
import {
  MealType,
  useAddRestaurant,
} from "~/app/dashboard/restaurants/add/context";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import { Button } from "~/components/ui/button";
import { InsertMeal } from "~/server/db/schemaTypes";
import { columns } from "./columns";
import MealsOfferedForm from "./mealsOfferedForm";
import { deleteRestaurantMeal } from "~/server/db/queries/restaurants";
import { toast } from "~/hooks/use-toast";

const MealsOfferedTab = () => {
  const [addedMealsOffered, setAddedMealsOffered] = useState<InsertMeal[]>([]); // State to handle added activities
  const { addMeals, restaurantDetails, setActiveTab, deleteMealType , duplicateMealType} =
    useAddRestaurant(); // Assuming similar context structure for activities
  const [selectedMealType, setSelectedMealType] = useState<MealType>({
    mealType: "",
    startTime: "",
    endTime: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const updateMealsOffered = (meal: InsertMeal) => {
    console.log("Adding Meals Offered");
    addMeals(meal);
    setAddedMealsOffered((prevMealsOffered) => [...prevMealsOffered, meal]); // Update local state
    setSelectedMealType({
      mealType: "",
      startTime: "",
      endTime: "",
      id: undefined
    })
  };

  const onRowEdit = (row: MealType) => {
    console.log(row);
    if(row.id){
      setSelectedMealType(row);
    } else {
      toast({
        title: "This meal has not been saved",
        description: "Please save the meal before editing or delete the meal and add a new one with correct details",
      })
    }
  };

  const onRowDelete = async (row: MealType) => {
    try {
      if(row.id){
        setIsDeleting(true);
        const response = await deleteRestaurantMeal(row.id);
        if (!response) {
          throw new Error(`Error: Failed to delete meal`);
        }
      }
      deleteMealType(row.mealType, row.startTime, row.endTime);
      setIsDeleting(false);
      toast({
        title: "success",
        description: "Meal deleted successfully",
      })
      setSelectedMealType({
        mealType: "",
        startTime: "",
        endTime: "",
        id: undefined
      })
    } catch (error) {
      console.log(error);
      setIsDeleting(false);
      toast({
        title: "error",
        description: "Failed to delete meal",
      });
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-2">
        <div className="card w-[90%] space-y-6">
          <div className="card-title">Meals Offered Information</div>
          <MealsOfferedForm onAddMeal={updateMealsOffered} selectedMealType={selectedMealType} />
        </div>
      </div>

      <div className="flex w-[90%] flex-col items-center justify-center gap-2">
        <div className="w-full">
          <DataTableWithActions
            columns={columns}
            data={restaurantDetails.mealsOffered}
            onDelete={onRowDelete}
            onEdit={onRowEdit}
            onRowClick={(row) => {
              // setSelectedMealType(row)
              console.log(row)
            }}
            isDeleting={isDeleting}
            // onDuplicate={onRowDuplicate}
          />
        </div>
        <div className="flex w-full justify-end">
          <Button
            variant={"primaryGreen"}
            onClick={() => {
              setActiveTab("submit");
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealsOfferedTab;
