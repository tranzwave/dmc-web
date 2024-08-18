import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { HotelStaffType } from "../generalForm/columns";

interface StaffFormProps {
  onAddStaff: (staff: HotelStaffType) => void;
}

// Define the schema for staff details
export const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
  occupation: z.string().min(1, "Occupation is required"),
});

const StaffForm: React.FC<StaffFormProps> = ({ onAddStaff }) => {
  const staffForm = useForm<HotelStaffType>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      contactNumber: '',
      occupation: '',
    },
  });

  const onSubmit: SubmitHandler<HotelStaffType> = (data) => {
    onAddStaff(data);
    staffForm.reset();
  };

  return (
    <Form {...staffForm}>
      <form onSubmit={staffForm.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-4 gap-3">
          <FormField name="name" control={staffForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter staff name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="email" control={staffForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="contactNumber" control={staffForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter contact number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="occupation" control={staffForm.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Input placeholder="Enter occupation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="w-full flex flex-row justify-end">
          <Button type="submit" variant={'primaryGreen'} className="px-5">Add Staff</Button>
        </div>
      </form>
    </Form>
  );
};

export default StaffForm;
