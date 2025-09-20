"use client";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShopVoucher,
  useEditBooking,
} from "~/app/dashboard/bookings/[id]/edit/context";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { useToast } from "~/hooks/use-toast";
import { ShopsSearchParams } from "~/lib/api";
import { getAllCities } from "~/server/db/queries/activities";
import { addShopVouchersToBooking } from "~/server/db/queries/booking";
import { getAllShopTypes } from "~/server/db/queries/shops";
import { deleteShopVoucher as deleteShopVoucherFromDB } from "~/server/db/queries/booking/shopsVouchers";
import { SelectCity, SelectShopType } from "~/server/db/schemaTypes";
import { columns, Shop } from "./columns";
import ShopsForm from "./shopsForm";
import { useOrganization } from "@clerk/nextjs";
import DeletePopup from "~/components/common/deletePopup";
import { DataTableWithActions } from "~/components/common/dataTableWithActions";

const ShopsTab = () => {
  const { addShop, bookingDetails, setActiveTab, deleteShopVoucher, updateTriggerRefetch } = useEditBooking();
  const [searchResults, setSearchResults] = useState<Shop[]>([]);
  const [searchDetails, setSearchDetails] = useState<Shop | null>(null);
  const [cities, setCities] = useState<SelectCity[]>([]);
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [shopTypes, setShopTypes] = useState<SelectShopType[]>([]);
  const { toast } = useToast();
  const {memberships, organization, isLoaded} = useOrganization();


  const [saving, setSaving] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<ShopVoucher | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnsavedVoucherDelete, setIsUnsavedVoucherDelete] = useState(false);
  const [isExistingVoucherDelete, setIsExistingVoucherDelete] = useState(false);

  const pathname = usePathname();
  const bookingLineId = pathname.split("/")[3];

  const handleRowClick = (shop: ShopVoucher) => {
    if (searchDetails) {
      // setSearchDetails(shop)
      addShop(shop);
    }
  };

  const onDelete = async (voucher: ShopVoucher) => {
    setSelectedVoucher(voucher);
    if (!voucher.voucher?.id) {
      // This is an unsaved voucher (no ID yet)
      setIsUnsavedVoucherDelete(true);
    } else {
      // This is an existing voucher
      setIsExistingVoucherDelete(true);
    }
  };

  const handleUnsavedVoucherDelete = () => {
    if (selectedVoucher) {
      const index = bookingDetails.shops.findIndex(v => v === selectedVoucher);
      deleteShopVoucher(index, selectedVoucher.voucher?.id ?? "");
      setIsUnsavedVoucherDelete(false);
      setSelectedVoucher(null);
    }
  };

  const handleExistingVoucherDelete = async () => {
    if (selectedVoucher && selectedVoucher.voucher?.status) {
      if (selectedVoucher.voucher.status !== "inprogress") {
        toast({
          title: "Uh Oh",
          description: `You can't delete this voucher. It's already ${selectedVoucher.voucher.status}! Please go to proceed vouchers and send the cancellation voucher first`,
        });
        return;
      }
      try {
        setIsDeleting(true);
        const deletedData = await deleteShopVoucherFromDB(selectedVoucher.voucher.id!);
        if (!deletedData) {
          throw new Error("Couldn't delete voucher");
        }

        deleteVoucherLineFromLocalContext();
        setIsDeleting(false);
        updateTriggerRefetch();
        toast({
          title: "Success",
          description: "Shop voucher deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Uh Oh",
          description: "Couldn't delete this voucher",
        });
        setIsDeleting(false);
      }
      setIsExistingVoucherDelete(false);
      setSelectedVoucher(null);
      return;
    }
  };

  const deleteVoucherLineFromLocalContext = () => {
    setIsDeleting(true);
    const index = bookingDetails.shops.findIndex(
      (v) => v === selectedVoucher,
    );
    deleteShopVoucher(index, selectedVoucher?.voucher?.id ?? "");
    setIsDeleting(false);
  };

  const updateShopVouchers = async (shop: ShopVoucher) => {
    addShop(shop);

    try {
      setSaving(true);
      const newResponse = await addShopVouchersToBooking(
        [shop],
        bookingLineId ?? "",
        bookingDetails.general.marketingManager,
      );

      if (!newResponse) {
        throw new Error(`Error: Couldn't add shop vouchers`);
      }
      console.log("Fetched Shops:", newResponse);

      setSaving(false);
      toast({
        title: "Success",
        description: "Shops Vouchers Added!",
      });
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        // setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
      setSaving(false);
      toast({
        title: "Uh Oh!",
        description: "Couldn't add shop vouchers!",
      });
    }
  };

  // Function to search for drivers based on transport data
  const fetchShops = async (searchParams: ShopsSearchParams) => {
    // try {
    //     const results = await searchShopsData(searchParams);
    //     setSearchResults(results);
    // } catch (error) {
    //     console.error("Error searching for drivers:", error);
    // }
  };

  const fetchData = async () => {
    try {
      // Run both requests in parallel
      setLoading(true);
      //TODO: Dynamic country code
      const country = organization?.publicMetadata.country as string ?? "LK";

      const [shopTypeResponse, cityResponse] = await Promise.all([
        getAllShopTypes(),
        getAllCities(country),
      ]);

      // Check for errors in the responses
      if (!shopTypeResponse) {
        throw new Error("Error fetching agents");
      }

      if (!cityResponse) {
        throw new Error("Error fetching users");
      }

      console.log("Fetched Shop Types:", shopTypeResponse);
      console.log("Fetched Cities:", cityResponse);

      // Set states after successful fetch
      setShopTypes(shopTypeResponse);
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

  const onNextClick = () => {
    console.log(bookingDetails);
    if (bookingDetails.shops.length > 0) {
      setActiveTab("submit");
    } else {
      toast({
        title: "Uh Oh!",
        description: "You must add shops to continue",
      });
    }
  };

  const onSaveClick = async () => {
    console.log(bookingDetails.shops);
    const newVouchers = bookingDetails.shops.filter((v) =>
      v.voucher?.id ? false : true,
    );

    if (newVouchers.length == 0) {
      toast({
        title: "Uh Oh!",
        description: "No new vouchers to add!",
      });

      return;
    }
    try {
      setSaving(true);
      const newResponse = await addShopVouchersToBooking(
        newVouchers,
        bookingLineId ?? "",
        bookingDetails.general.marketingManager,
      );

      if (!newResponse) {
        throw new Error(`Error: Couldn't add shop vouchers`);
      }
      console.log("Fetched Shops:", newResponse);

      setSaving(false);
      toast({
        title: "Success",
        description: "Shops Vouchers Added!",
      });
    } catch (error) {
      if (error instanceof Error) {
        // setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
      setSaving(false);
      toast({
        title: "Uh Oh!",
        description: "Couldn't add shop vouchers!",
      });
    }
  };

  useEffect(() => {
    // if (!bookingDetails.general.includes.shops) {
    //   console.log("Shops not included in booking details, setting active tab to submit");
    //   setActiveTab("submit");
    //   return () => {
    //     console.log("Return");
    //   };
    // }
    fetchData();
  }, []);

  if (loading || !isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-center gap-3">
        <div>
          <Calendar
            mode="range"
            selected={{
              from: new Date(bookingDetails.general.startDate),
              to: new Date(bookingDetails.general.endDate),
            }}
            className="rounded-md"
          />
        </div>

        <div className="card w-full space-y-6">
          <div className="card-title">Shop Information</div>
          <ShopsForm
            onAddShop={updateShopVouchers}
            shopTypes={shopTypes}
            cities={cities}
            isSaving={saving}
          />
        </div>
      </div>
      <div className="w-full">
        <DataTableWithActions 
          columns={columns} 
          data={bookingDetails.shops} 
          onRowClick={handleRowClick}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </div>
        <div className="flex w-full justify-end gap-2">
          {/* <Button variant={"primaryGreen"} onClick={onSaveClick} disabled={saving}>
            {saving ? (<div className="flex flex-row gap-1"><div><LoaderCircle className="animate-spin" size={15}/></div>Saving</div>): ('Save')}
          </Button> */}
          <Link href={`${pathname.split("edit")[0]}/tasks?tab=shops`}>
            <Button variant={"primaryGreen"}>Send Vouchers</Button>
          </Link>
        </div>

      <DeletePopup
        itemName={`Voucher for ${selectedVoucher?.shop.name}`}
        onDelete={handleUnsavedVoucherDelete}
        isOpen={isUnsavedVoucherDelete}
        setIsOpen={setIsUnsavedVoucherDelete}
        isDeleting={isDeleting}
      />

      <DeletePopup
        itemName={`Voucher for ${selectedVoucher?.shop.name}`}
        onDelete={handleExistingVoucherDelete}
        isOpen={isExistingVoucherDelete}
        setIsOpen={setIsExistingVoucherDelete}
        isDeleting={isDeleting}
        description={selectedVoucher?.voucher?.status !== "inprogress" 
          ? `You can't delete this voucher. It's already ${selectedVoucher?.voucher?.status}! Please go to proceed vouchers and send the cancellation voucher first.`
          : "Are you sure you want to delete this shop voucher? This action cannot be undone."
        }
      />
    </div>
  );
};

export default ShopsTab;
