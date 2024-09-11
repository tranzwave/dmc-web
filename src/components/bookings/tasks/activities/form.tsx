"use client";
import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  SelectActivity,
  SelectActivityType,
  SelectActivityVendor,
} from "~/server/db/schemaTypes";
import { ActivityVoucherData } from ".";

// Define the schema using Zod
const activityVoucherSchema = z.object({
  activityName: z.string().min(1, "Activity name is required"),
  vendorName: z.string().min(1, "Vendor name is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  city: z.string().min(1, "City is required"),
  headcount: z.number().min(1, "Headcount must be at least 1"),
  remarks: z.string().optional(),
});

// Type inferred from the schema
type ActivityVoucherFormData = z.infer<typeof activityVoucherSchema>;

// Define your props interface
interface ActivityVoucherFormProps {
  selectedItem: ActivityVoucherData | undefined;
  onSave: () => void;
  vendor: ActivityVoucherData;
}

const ActivityVoucherForm: React.FC<ActivityVoucherFormProps> = ({
  selectedItem,
  onSave,
  vendor,
}) => {
  const [activities, setActivities] = useState<SelectActivityType[]>([]);
  const form = useForm<ActivityVoucherFormData>({
    resolver: zodResolver(activityVoucherSchema),
    defaultValues: selectedItem
      ? {
          activityName: selectedItem.activity.name,
          vendorName: selectedItem.activityVendor.name,
          date: selectedItem.date ?? "",
          time: selectedItem.time ?? "",
          city: selectedItem.city ?? "",
          headcount: selectedItem.participantsCount ?? 1,
          remarks: selectedItem.remarks ?? "",
        }
      : {
          activityName: "",
          vendorName: "",
          date: "",
          time: "",
          city: "",
          headcount: 1,
          remarks: "",
        },
  });

  const handleSubmit = (values: ActivityVoucherFormData) => {
    onSave();
  };

  useEffect(() => {
    console.log(selectedItem);
    if (selectedItem) {
      // getRestaurants()
    }
  }, [selectedItem]);

  if (!selectedItem) {
    return <div></div>;
  }

  return (
    <div></div>
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
    //     <div className="grid grid-cols-2 gap-3">
    //       {/* Existing fields */}
    //       <FormField
    //         name="vendorName"
    //         control={form.control}
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Vendor Name</FormLabel>
    //             <FormControl>
    //               <Input
    //                 placeholder="Enter vendor"
    //                 {...field}
    //                 defaultValue={vendor?.activityVendor.name ?? ""}
    //                 disabled={true}
    //               />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <FormField
    //         name="activityName"
    //         control={form.control}
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Activity Name</FormLabel>
    //             <FormControl>
    //               <Select
    //                 {...field}
    //                 onValueChange={(value) => field.onChange(value)}
    //                 value={field.value}
    //               >
    //                 <SelectTrigger>
    //                   <SelectValue placeholder="Select activity" />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   {activities.map((activity) => (
    //                     <SelectItem key={activity.id} value={activity.name}>
    //                       {activity.name}
    //                     </SelectItem>
    //                   ))}
    //                 </SelectContent>
    //               </Select>
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <FormField
    //         name="headcount"
    //         control={form.control}
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Headcount</FormLabel>
    //             <FormControl>
    //               <Input type="number" {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       {/* New fields */}
    //       <FormField
    //         name="date"
    //         control={form.control}
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Date</FormLabel>
    //             <FormControl>
    //               <Input type="date" {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <FormField
    //         name="time"
    //         control={form.control}
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Time</FormLabel>
    //             <FormControl>
    //               <Input type="time" {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <FormField
    //         name="city"
    //         control={form.control}
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>City</FormLabel>
    //             <FormControl>
    //               <Input placeholder="Enter city" {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />

    //       <FormField
    //         name="remarks"
    //         control={form.control}
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Remarks</FormLabel>
    //             <FormControl>
    //               <Input placeholder="Enter any remarks" {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //     </div>
    //     <div className="flex w-full justify-end">
    //       <Button variant={"primaryGreen"} type="submit">
    //         Save
    //       </Button>
    //     </div>
    //   </form>
    // </Form>
  );
};

export default ActivityVoucherForm;
