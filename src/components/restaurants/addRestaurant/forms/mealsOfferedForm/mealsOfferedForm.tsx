"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { MealType } from "~/app/dashboard/restaurants/add/context";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface MealsOfferedFormProps {
  onAddMeal: (meal: MealType) => void;
  selectedMealType: MealType
}

// Define the schema for form validation
export const mealsOfferedSchema = z.object({
  mealType: z.string().min(1, "End time is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "Contact number is required"),
});

const MealsOfferedForm: React.FC<MealsOfferedFormProps> = ({ onAddMeal, selectedMealType }) => {
  const mealsOfferedForm = useForm<MealType>({
    resolver: zodResolver(mealsOfferedSchema),
    defaultValues: {
      mealType: "",
      startTime: "",
      endTime: "",
    },
  });

  const {reset} = mealsOfferedForm;


  const onSubmit: SubmitHandler<MealType> = (data) => {
    onAddMeal({
        ...data,
        typeName : data.typeName
    });
    mealsOfferedForm.reset();
  };

  useEffect(()=>{
    reset(selectedMealType)

  }, [selectedMealType,reset])

  return (
    <Form {...mealsOfferedForm}>
      <form onSubmit={mealsOfferedForm.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            name="mealType"
            control={mealsOfferedForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meal Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter meal type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="startTime"
            control={mealsOfferedForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input placeholder="" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="endTime"
            control={mealsOfferedForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input placeholder="" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-row justify-end">
          <Button type="submit" variant={"primaryGreen"}>
            Add Meal
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MealsOfferedForm;
