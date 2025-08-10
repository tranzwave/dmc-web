import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAddHotel } from "~/app/dashboard/hotels/add/context";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { HotelStaffType } from "../staffForm/columns";
import { staffSchema } from "../schemas";

interface StaffFormProps {
  onAddStaff: (staff: HotelStaffType) => void;
  selectedStaff: HotelStaffType
}

const StaffForm: React.FC<StaffFormProps> = ({ onAddStaff, selectedStaff }) => {
  const { staffDraft, setStaffDraft } = useAddHotel();
  const lastDraftKeyRef = useRef<string>("");
  const lastResetKeyRef = useRef<string>("");

  const staffForm = useForm<HotelStaffType>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      contactNumber: '',
      occupation: '',
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const {reset, watch, getValues} = staffForm;

  const onSubmit: SubmitHandler<HotelStaffType> = (data) => {
    onAddStaff({
      ...data,
      id: selectedStaff?.id ?? undefined
    });
    staffForm.reset();
    setStaffDraft(null);
    lastDraftKeyRef.current = "";
  };

  const toStableKey = (v: Partial<HotelStaffType> | null | undefined) => JSON.stringify(v ?? {});

  useEffect(() => {
    const hasSelection = !!(selectedStaff?.id ?? selectedStaff?.name ?? selectedStaff?.email ?? selectedStaff?.contactNumber ?? selectedStaff?.occupation);
    const target: Partial<HotelStaffType> | undefined = hasSelection
      ? selectedStaff
      : staffDraft ?? undefined;
    if (!target) return;
    const keyTarget = toStableKey(target);
    const keyCurrent = toStableKey(getValues());
    if (keyTarget !== keyCurrent && lastResetKeyRef.current !== keyTarget) {
      lastResetKeyRef.current = keyTarget;
      reset(target as any);
    }
  }, [selectedStaff, staffDraft, reset, getValues]);

  useEffect(() => {
    const sub = watch((value) => {
      const nextDraft = { ...(value as any), id: selectedStaff?.id ?? (value as any)?.id } as any;
      const key = JSON.stringify(nextDraft);
      if (lastDraftKeyRef.current !== key) {
        lastDraftKeyRef.current = key;
        setStaffDraft(nextDraft);
      }
    });
    return () => sub.unsubscribe();
  }, [watch, setStaffDraft, selectedStaff?.id]);

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
                <PhoneInput
                    country={"us"}
                    value={field.value}
                    onChange={(phone) => field.onChange(`+${phone}`)}
                    inputClass="w-full shadow-md"
                    inputStyle={{ width: "inherit" }}
                  />
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
