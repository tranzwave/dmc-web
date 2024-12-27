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
import { VoucherConfirmationDetails } from "~/lib/types/booking";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

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
  updateVoucherStatus: (selectedVoucher:any,confirmationDetails: VoucherConfirmationDetails) => Promise<boolean>;
}) => {
  // Initialize the form with useForm and apply the Zod resolver
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ConfirmationFormValues>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      responsiblePersonName: selectedVoucher?.responsiblePerson ?? "",
      confirmationNumber: selectedVoucher?.confirmationNumber ?? "",
      reminderDate: selectedVoucher?.reminderDate ?? "",
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: ConfirmationFormValues) => {
    setIsLoading(true);
    selectedVoucher?.status
      ? (selectedVoucher.status = "vendorConfirmed")
      : "sentToVendor";
      try {
        const updated =  await updateVoucherStatus(selectedVoucher, {
          responsiblePerson: data.responsiblePersonName,
          confirmationNumber: data.confirmationNumber,
          reminderDate: data.reminderDate,
        });
        if (!updated) {
          throw new Error("Failed to update the voucher status");
        }
        toast({
          title: "Success",
          description: "Successfully updated the voucher status",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Error updating the voucher status",
        });
      } finally {
        setIsLoading(false);
      }
  };

  if (!selectedVoucher?.status) {
    return (
      <div>
        <p>Please select a voucher</p>
      </div>
    );
  }

  if (selectedVoucher.status === "sentToVendor" || selectedVoucher.status === "vendorConfirmed") {
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
              {isLoading ? (<div className="flex flex-row items-center">
                <LoaderCircle size={20} className="mr-2 animate-spin" />
                <span>Confirming</span>
              </div>) : selectedVoucher.status === "vendorConfirmed" ? "Re-Confirm Vendor" : "Confirm Vendor"}
            </Button>
          </div>
        </form>
      </Form>
    );
  }
};
