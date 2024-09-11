// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { z } from "zod";
// import { useEditAgent } from "~/app/dashboard/agents/[id]/edit/context";
// import { Button } from "~/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "~/components/ui/form";
// import { Input } from "~/components/ui/input";

// // Define the schema for form validation
// export const generalSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   country: z.string().min(1, "Activity is required"),
//   primaryEmail: z.string().email("Invalid email address"),
//   primaryContactNumber: z.string().min(1, "Contact number is required"),
//   agency: z.string().min(1, "Street name is required"),
//   feild1: z.string().min(1, "City is required"),
//   feild2: z.string().min(1, "Province is required"),
//   feild3: z.string().min(1, "Capacity is required"),
// });

// // Define the type of the form values
// type GeneralFormValues = z.infer<typeof generalSchema>;

// const GeneralForm = () => {
//   const { setGeneralDetails, agentDetails } = useEditAgent();
//   const form = useForm<GeneralFormValues>({
//     resolver: zodResolver(generalSchema),
//     defaultValues: agentDetails.general,
//   });

//   const onSubmit: SubmitHandler<GeneralFormValues> = (data) => {
//     console.log(data);
//     setGeneralDetails(data);
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <div className="grid grid-cols-4 gap-4">
//           <FormField
//             name="name"
//             control={form.control}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             name="country"
//             control={form.control}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Country</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter country" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             name="primaryEmail"
//             control={form.control}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Primary Email</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="email"
//                     placeholder="Enter primary email"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             name="primaryContactNumber"
//             control={form.control}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Contact Number</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     placeholder="Enter contact number"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="grid grid-cols-3 gap-4">
//           <div className="col-span-1">
//             <FormField
//               name="agency"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Agency</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter Agency" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="col-span-2">
//             <div className="grid grid-cols-3 gap-4">
//               <FormField
//                 name="feild1"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Feild 1</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter feild 1" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 name="feild2"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Feild 2</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter feild 2" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 name="feild3"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Feild 3</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter feild 3" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex w-full flex-row justify-end">
//           <Button type="submit" variant={"primaryGreen"}>
//             Submit
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default GeneralForm;


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useEditAgent } from "~/app/dashboard/agents/[id]/edit/context";
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

// Define the schema for form validation
export const generalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  primaryEmail: z.string().email("Invalid email address"),
  primaryContactNumber: z.string().min(1, "Contact number is required"),
  agency: z.string().min(1, "Agency is required"),
  field1: z.string().min(1, "Field 1 is required"),
  field2: z.string().min(1, "Field 2 is required"),
  field3: z.string().min(1, "Field 3 is required"),
});

// Define the type of the form values
type GeneralFormValues = z.infer<typeof generalSchema>;

const GeneralForm = () => {
  const { setGeneralDetails, agentDetails } = useEditAgent();
  
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: agentDetails.general || {}, // Default to empty object if no data
  });

  const onSubmit: SubmitHandler<GeneralFormValues> = (data) => {
    console.log("Form Data Submitted:", data);
    setGeneralDetails({
      agency:data.agency,
      country:data.country,
      feild1:data.field1,
      feild2:data.field2,
      feild3:data.field3,
      name:data.name,
      primaryContactNumber:data.primaryContactNumber,
      primaryEmail:data.primaryEmail
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="country"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Enter country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="primaryEmail"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter primary email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="primaryContactNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel" // Use type="tel" for phone numbers
                    placeholder="Enter contact number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <FormField
              name="agency"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agency</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Agency" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                name="field1"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Field 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="field2"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Field 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="field3"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field 3</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Field 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-row justify-end">
          <Button type="submit" variant={"primaryGreen"}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneralForm;
