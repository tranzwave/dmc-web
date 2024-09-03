import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";

// Define Zod schema
const confirmationSchema = z.object({
  responsiblePersonName: z
    .string()
    .min(1, "Responsible Person Name is required"),
  confirmationNumber: z.string().min(1, "Confirmation Number is required"),
  reminderDate: z.string().min(1, "Reminder Date is required"),
});

type ConfirmationFormValues = z.infer<typeof confirmationSchema>;

export const ConfirmationForm = ({
  selectedVoucher,
  updateVoucherStatus,
}: {
  selectedVoucher: any;
  updateVoucherStatus: (data: ConfirmationFormValues) => boolean;
}) => {
  // Initialize the form with useForm and apply the Zod resolver
  const form = useForm<ConfirmationFormValues>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      responsiblePersonName: "",
      confirmationNumber: "",
      reminderDate: "",
    },
  });

  const { toast } = useToast();

  const onSubmit = (data: ConfirmationFormValues) => {
    selectedVoucher?.status
      ? (selectedVoucher.status = "vendorConfirmed")
      : "sentToVendor";
    updateVoucherStatus(selectedVoucher)
      ? toast({
          title: "Success",
          description: "Successfully updated the voucher status",
        })
      : toast({
          title: "Error",
          description: "Error updating the voucher status",
        });
  };

  if (!selectedVoucher?.status) {
    return (
      <div>
        <p>Please select a voucher</p>
      </div>
    );
  }

  if (selectedVoucher.status === "sentToVendor") {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="responsiblePersonName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsible Person's Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter responsible person's name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmation Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter confirmation number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reminderDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reminder Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full flex-row justify-end">
            <Button
              variant={"primaryGreen"}
              type="submit"
              className="btn btn-primary w-full"
            >
              Confirm Now
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  if (selectedVoucher.status === "inprogress") {
    return (
      <div>
        <p>Click Proceed and send voucher first</p>
      </div>
    );
  } else {
    return <div>You have already confirmed the voucher</div>;
  }
};
