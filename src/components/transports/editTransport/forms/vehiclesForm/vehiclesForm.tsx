"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Vehicles } from "./columns";

interface VehiclesFormProps {
  onAddVehicles: (vehicles: Vehicles) => void;
}

// Define the schema for form validation
export const vehiclesSchema = z.object({
  vehicle: z.string().min(1, "Vehicle is required"),
  numberPlate: z.string().min(1, "Number Plate is required"),
  seats: z.number().min(1, "Number of seats is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  vrl: z.string().min(1, "VRL is required"),
});

// Define the type of the form values
type VehiclesFormValues = z.infer<typeof vehiclesSchema>;

const VehiclesForm: React.FC<VehiclesFormProps> = ({ onAddVehicles }) => {
  const form = useForm<VehiclesFormValues>({
    resolver: zodResolver(vehiclesSchema),
    defaultValues: {
      vehicle: "",
      numberPlate: "",
      seats: 1,
      make: "",
      model: "",
      year: "",
      vrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof vehiclesSchema>) {
    onAddVehicles({
      ...values,
      seats: Number(values.seats),
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <FormField
              name="vehicle"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2">
            <FormField
              name="numberPlate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number Plate</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter number plate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1">
            <FormField
              name="seats"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seats</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of seats"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <FormField
              name="make"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Street Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                name="model"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="year"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="Enter year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="vrl"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VRL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter VRL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-row justify-end gap-2">
          <Button type="submit" variant={"primaryGreen"}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehiclesForm;
