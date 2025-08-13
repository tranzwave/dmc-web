"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TitleBar from "~/components/common/titleBar";
import HotelGeneralTab from "~/components/hotels/addHotel/forms/generalForm";
import RoomsTab from "~/components/hotels/addHotel/forms/roomsForm";
import StaffTab from "~/components/hotels/addHotel/forms/staffForm";
import AddHotelSubmitView from "~/components/hotels/addHotel/forms/submitForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AddHotelProvider, useAddHotel } from "./context";
import { useOrganization } from "@clerk/nextjs";
import { getAllCities } from "~/server/db/queries/activities";
import { getAllRoomCategories } from "~/server/db/queries/roomCategories";
import { SelectCity } from "~/server/db/schemaTypes";

const AddHotel = () => {
  const pathname = usePathname();
  const { hotelGeneral, hotelRooms, hotelStaff, setActiveTab, activeTab } = useAddHotel();
  const { organization, isLoaded } = useOrganization();
  const [cities, setCities] = useState<SelectCity[]>([]);
  const [customRoomCategories, setCustomRoomCategories] = useState<string[]>([]);
  const lookupsFetchedRef = useRef(false);

  useEffect(() => {
    // Load lookups when org is ready
    const loadLookups = async () => {
      try {
        if (!organization) return;
        const country = (organization.publicMetadata.country as string) ?? "LK";
        const [cityRes, catRes] = await Promise.all([
          getAllCities(country),
          getAllRoomCategories(organization.id),
        ]);
        setCities(cityRes ?? []);
        setCustomRoomCategories((catRes ?? []).map((c) => c.name));
      } catch (e) {
        console.error("Failed to load lookups", e);
      }
    };
    if (lookupsFetchedRef.current) return;
    if (isLoaded) {
      lookupsFetchedRef.current = true;
      loadLookups();
    }
  }, [isLoaded, organization]);

  useEffect(() => {
    console.log("Add Booking Component");
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Add Hotel" link="toAddBooking" />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
          </div>
          <div className="w-full">
            <Tabs defaultValue="general" className="w-full border" value={activeTab}>
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger value="general" isCompleted={false} onClick={() => setActiveTab("general")} inProgress={activeTab == "general"}>
                  General
                </TabsTrigger>
                <TabsTrigger value="rooms" statusLabel={"Included"} isCompleted={hotelRooms.length > 0} inProgress={activeTab == "rooms"} disabled={!hotelGeneral.province}>
                  Rooms
                </TabsTrigger>
                <TabsTrigger value="staff" statusLabel={"Included"} isCompleted={hotelStaff.length > 0} inProgress={activeTab == "staff"} disabled={hotelRooms.length == 0}>
                  Staff
                </TabsTrigger>
                <TabsTrigger value="submit" inProgress={activeTab == "submit"} disabled={hotelStaff.length == 0}>
                  Submit
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <HotelGeneralTab cities={cities} orgId={organization?.id ?? ""} />
              </TabsContent>
              <TabsContent value="rooms">
                <RoomsTab customRoomCategories={customRoomCategories} />
              </TabsContent>
              <TabsContent value="staff">
                <StaffTab />
              </TabsContent>
              <TabsContent value="submit">
                <AddHotelSubmitView />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedAddBooking() {
  return (
    <AddHotelProvider>
      <AddHotel />
    </AddHotelProvider>
  );
}
