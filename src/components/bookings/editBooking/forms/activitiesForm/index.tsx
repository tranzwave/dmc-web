"use client";
import { LoaderCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useEditBooking } from "~/app/dashboard/bookings/[id]/edit/context";
import {
  ActivityVoucher
} from "~/app/dashboard/bookings/add/context";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";
import DeletePopup from "~/components/common/deletePopup";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { useToast } from "~/hooks/use-toast";
import {
  getAllActivityTypes,
  getAllCities,
} from "~/server/db/queries/activities";
import { addActivityVouchersToBooking, deleteActivitiesVoucher } from "~/server/db/queries/booking";
import {
  SelectActivityType,
  SelectActivityVendor,
  SelectCity
} from "~/server/db/schemaTypes";
import ActivitiesForm from "./actvitiesForm";
import { columns } from "./columns";

const ActivitiesTab = () => {
  const [addedActivities, setAddedActivities] = useState<ActivityVoucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [activityTypes, setActivityTypes] = useState<SelectActivityType[]>([]);
  const [cities, setCities] = useState<SelectCity[]>([]);
  const [activities, setActivities] = useState<SelectActivityVendor[]>([]);
  const [error, setError] = useState<string | null>();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<ActivityVoucher>();
  const [isExistingVoucherDelete, setIsExistingVoucherDelete] = useState(false);
  const [isUnsavedVoucherDelete, setIsUnsavedVoucherDelete] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    addActivity,
    bookingDetails,
    setActiveTab,
    editActivityVoucher,
    deleteActivityVoucher,
    updateTriggerRefetch,
  } = useEditBooking();


  const pathname = usePathname()
  const bookingLineId = pathname.split("/")[3]

  const updateActivities = (voucher: ActivityVoucher) => {
    setAddedActivities((prev) => [...prev, voucher]);
    addActivity(voucher);
  };
  const fetchData = async () => {
    try {
      // Run both requests in parallel
      setLoading(true);
      //TODO: Dynamic country code
      const [activityResponse, cityResponse] = await Promise.all([
        getAllActivityTypes(),
        getAllCities("LK"),
      ]);

      // Check for errors in the responses
      if (!activityResponse) {
        throw new Error("Error fetching agents");
      }

      if (!cityResponse) {
        throw new Error("Error fetching users");
      }

      console.log("Fetched Agents:", activityResponse);
      console.log("Fetched Users:", cityResponse);

      // Set states after successful fetch
      setActivityTypes(activityResponse);
      setCities(cityResponse);

      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if(!bookingDetails.general.includes.activities){
      setActiveTab("transport")
      return ()=>{console.log("Return")};
    }
    fetchData();
  }, []);

  const onNextClick = () => {
    console.log(bookingDetails);
    if (bookingDetails.activities.length > 0) {
      setActiveTab("transport");
    } else {
      toast({
        title: "Uh Oh!",
        description: "You must add activities to continue",
      });
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  const onSaveClick = async()=>{
    console.log(bookingDetails.vouchers)
    const newVouchers = bookingDetails.activities.filter(v => v.voucher?.id ? false : true);

    if(newVouchers.length == 0){
      toast({
        title: "Uh Oh!",
        description: "No new vouchers to add!",
      });

      return
    }
    try {
      setSaving(true)
      const newResponse = await addActivityVouchersToBooking(newVouchers,bookingLineId ?? "", bookingDetails.general.marketingManager);

      if (!newResponse) {
        throw new Error(`Error: Couldn't add activity vouchers`);
      }
      console.log("Fetched restaurant vouchers:", newResponse);

      setSaving(false);
      toast({
        title: "Success",
        description: "Activity Vouchers Added!",
      });
    } catch (error) {
      if (error instanceof Error) {
        // setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
      setSaving(false)
      toast({
        title: "Uh Oh!",
        description: "Couldn't add activity vouchers!",
      });
    }
  }

  const onDelete = async (data: ActivityVoucher) => {
    setSelectedVoucher(data);
    if (data.voucher.status) {
      setIsExistingVoucherDelete(true);
      return;
    }
    setIsUnsavedVoucherDelete(true);
    setIsDeleteOpen(true);
  };

  const handleExistingVoucherDelete = async () => {
    if (selectedVoucher && selectedVoucher.voucher.status) {
      if (selectedVoucher.voucher.status != "inprogress") {
        toast({
          title: "Uh Oh",
          description: `You cant delete this voucher. It's already ${selectedVoucher.voucher.status}!. Please go to proceed vouchers and send the cancellation voucher first`,
        });
        return;
      }
      try {
        setIsDeleting(true);
        const deletedData = await deleteActivitiesVoucher(
          selectedVoucher?.voucher?.id ?? "",
        );
        if (!deletedData) {
          throw new Error("Couldn't delete voucher");
        }

        deleteVoucherLineFromLocalContext();
        setIsDeleting(false);
      } catch (error) {
        toast({
          title: "Uh Oh",
          description: `Couldn't delete this voucher`,
        });
        setIsDeleting(false);
      }
      return;
    }
  };

  const deleteVoucherLineFromLocalContext = () => {
    setIsDeleting(true);
    const index = bookingDetails.activities.findIndex(
      (v) => v == selectedVoucher,
    );
    deleteActivityVoucher(index, selectedVoucher?.voucher?.id ?? "");
    setIsDeleting(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-center gap-3">
      <Calendar
            mode="range"
            selected={{
              from: new Date(bookingDetails.general.startDate),
              to: new Date(bookingDetails.general.endDate),
            }}
            className="rounded-md"
          />
        <div className="card w-full space-y-3">
          <div className="card-title">Activities Information</div>
          {activities && (
          <ActivitiesForm
            onAddActivity={updateActivities}
            activityTypes={activityTypes}
            cities={cities}
            isSaving={saving}
          />
        )}
        </div>
      </div>
      <div className=" flex flex-row justify-center gap-2">
        <div className="w-full">
          <DataTableWithActions columns={columns} data={bookingDetails.activities} 
         onEdit={()=>{console.log("edit")}}
         onDelete={onDelete}
         onRowClick={() => {console.log("row");}} 
         />
        </div>
      </div>
      <div className="flex w-full justify-end">
      <Button variant={"primaryGreen"} onClick={onSaveClick} disabled={saving}>
            {saving ? (<div className="flex flex-row gap-1"><div><LoaderCircle className="animate-spin" size={10}/></div>Saving</div>): ('Save')}
          </Button>
      </div>

      <DeletePopup
        itemName={`Voucher for ${selectedVoucher?.vendor.name}`}
        onDelete={deleteVoucherLineFromLocalContext}
        isOpen={isUnsavedVoucherDelete}
        setIsOpen={setIsUnsavedVoucherDelete}
        isDeleting={isDeleting}
      />

      <DeletePopup
        itemName={`Voucher for ${selectedVoucher?.vendor.name}`}
        onDelete={handleExistingVoucherDelete}
        isOpen={isExistingVoucherDelete}
        setIsOpen={setIsExistingVoucherDelete}
        isDeleting={isDeleting}
      />

    </div>
  );
};

export default ActivitiesTab;
