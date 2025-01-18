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

const MealsOfferedTab = () => {
  const [addedMealsOffered, setAddedMealsOffered] = useState<InsertMeal[]>([]); // State to handle added activities
  const { addMeals, restaurantDetails, setActiveTab, deleteMealType , duplicateMealType} =
    useAddRestaurant(); // Assuming similar context structure for activities
  const [selectedMealType, setSelectedMealType] = useState<MealType>({
    mealType: "",
    startTime: "",
    endTime: "",
  });

  const updateMealTypes = (mealTypes: MealType) => {
    console.log(mealTypes);
    addMeals(mealTypes);
    setSelectedMealType({
      mealType: "",
      startTime: "",
      endTime: ""
    });
  };

  const updateMealsOffered = (meal: InsertMeal) => {
    console.log("Adding Meals Offered");
    addMeals(meal);
    setAddedMealsOffered((prevMealsOffered) => [...prevMealsOffered, meal]); // Update local state
  };

  const onRowEdit = (row: MealType) => {
    console.log(row);
    setSelectedMealType(row);
  };

  const onRowDuplicate = (row: MealType) => {
    duplicateMealType(row.mealType, row.startTime, row.endTime);
  };

  const onRowDelete = (row: MealType) => {
    deleteMealType(row.mealType, row.startTime, row.endTime);
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
            onRowClick={onRowEdit}
            onDuplicate={onRowDuplicate}
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
