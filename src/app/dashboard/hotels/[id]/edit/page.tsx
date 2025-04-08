"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import HotelGeneralTab from "~/components/hotels/addHotel/forms/generalForm";
import RoomsTab from "~/components/hotels/addHotel/forms/roomsForm";
import StaffTab from "~/components/hotels/addHotel/forms/staffForm";
import EditHotelSubmitView from "~/components/hotels/addHotel/forms/submitForm/editHotelSubmit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CompleteHotel, getRawHotelById } from "~/server/db/queries/hotel";
import { AddHotelProvider, useAddHotel } from "../../add/context";



const EditHotel = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const { hotelGeneral, hotelRooms, hotelStaff, setActiveTab, activeTab, setHotelGeneral,addHotelRoom, addHotelStaff, addBulkHotelRooms, addBulkHotelStaff } =
    useAddHotel();
    const searchParams = useSearchParams();
  const [hotel, setHotel] = useState<CompleteHotel>();
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // const result = await getHotelData();
        const result = await getRawHotelById(id);

        if(!result){
            throw new Error("Couldn't fetch hotel")
        }

        console.log("Fetched hotel data:", result);
        const { hotelRoom: hotelRooms, hotelStaff: hotelStaffs, ...restOfHotel } = result;

        setHotel({
            hotel: restOfHotel,
            hotelRooms:hotelRooms,
            hotelStaffs:hotelStaffs
        });
        setHotelGeneral({
            name: restOfHotel.name,
            stars: restOfHotel.stars,
            primaryEmail: restOfHotel.primaryEmail,
            primaryContactNumber: restOfHotel.primaryContactNumber,
            streetName: restOfHotel.streetName,
            cityId: Number(restOfHotel.cityId),
            tenantId: restOfHotel.tenantId,
            province: restOfHotel.province,
            hasRestaurant: restOfHotel.hasRestaurant,
          });
        
          if(hotelRooms){
            addBulkHotelRooms(hotelRooms)
            console.log(hotelRooms[0]?.id)
          }
          if(hotelStaffs){
            addBulkHotelStaff(hotelStaffs)
            console.log(hotelStaffs[0]?.id)
          }

      } catch (error) {
        console.error("Failed to fetch hotel data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if(loading){
    <div><LoadingLayout/></div>
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title={`Edit Hotel - ${hotel?.hotel.name}`} link="toAddBooking" />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
          </div>
          <div className="w-full">
            <Tabs
              defaultValue="general"
              className="w-full border"
              value={activeTab}
            >
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger
                  value="general"
                  isCompleted={false}
                  onClick={() => setActiveTab("general")}
                  inProgress={activeTab == "general"}
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="rooms"
                  statusLabel={"Included"}
                  isCompleted={hotelRooms.length > 0}
                  inProgress={activeTab == "rooms"}
                  disabled={!hotelGeneral.province}
                >
                  Rooms
                </TabsTrigger>
                <TabsTrigger
                  value="staff"
                  statusLabel={"Included"}
                  isCompleted={hotelStaff.length > 0}
                  inProgress={activeTab == "staff"}
                  disabled={hotelRooms.length == 0}
                >
                  Staff
                </TabsTrigger>
                <TabsTrigger
                  value="submit"
                  inProgress={activeTab == "submit"}
                  disabled={hotelStaff.length == 0}
                >
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
                <EditHotelSubmitView originalHotel={hotel ?? null} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedAddBooking({ params }: { params: { id: string } }) {
    
  return (
    <AddHotelProvider>
      <EditHotel id={params.id}/>
    </AddHotelProvider>
  );
}
