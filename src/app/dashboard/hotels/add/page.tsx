"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import TitleBar from "~/components/common/titleBar";
import HotelGeneralTab from "~/components/hotels/addHotel/forms/generalForm";
import RoomsTab from "~/components/hotels/addHotel/forms/roomsForm";
import StaffTab from "~/components/hotels/addHotel/forms/staffForm";
import AddHotelSubmitView from "~/components/hotels/addHotel/forms/submitForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AddHotelProvider, useAddHotel } from "./context";

const AddHotel = () => {
  const pathname = usePathname();
  const { hotelGeneral, hotelRooms, hotelStaff, setActiveTab,activeTab } = useAddHotel();

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
                <TabsTrigger value="general" isCompleted = {false} onClick={() => setActiveTab("general")} inProgress = {activeTab == "general"}>
                  General
                </TabsTrigger>
                <TabsTrigger value="rooms" statusLabel={"Mandatory"} isCompleted={hotelRooms.length > 0} inProgress = {activeTab == "rooms"} disabled={!hotelGeneral.province}>
                  Rooms
                </TabsTrigger>
                <TabsTrigger value="staff" statusLabel={"Mandatory"} isCompleted={hotelStaff.length > 0} inProgress = {activeTab == "staff"} disabled={hotelRooms.length == 0}>
                  Staff
                </TabsTrigger>
                <TabsTrigger value="submit" inProgress = {activeTab == "submit"} disabled={hotelStaff.length == 0}>
                  Submit
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <HotelGeneralTab />
              </TabsContent>
              <TabsContent value="rooms">
                <RoomsTab />
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
