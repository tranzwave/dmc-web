"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import HotelGeneralTab from "~/components/hotels/addHotel/forms/generalForm";
import RoomsTab from "~/components/hotels/addHotel/forms/roomsForm/index";
import StaffTab from "~/components/hotels/addHotel/forms/staffForm";
import EditHotelSubmitView from "~/components/hotels/addHotel/forms/submitForm/editHotelSubmit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CompleteHotel, getRawHotelById, updateHotelAndRelatedData } from "~/server/db/queries/hotel";
import { AddHotelProvider, useAddHotel } from "../../add/context";
import { useToast } from "~/hooks/use-toast";
import { useOrganization } from "@clerk/nextjs";
import { getAllCities } from "~/server/db/queries/activities";
import { getAllRoomCategories } from "~/server/db/queries/roomCategories";
import { SelectCity } from "~/server/db/schemaTypes";



const EditHotel = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { organization, isLoaded } = useOrganization();
  const { hotelGeneral, hotelRooms, hotelStaff, setActiveTab, activeTab, setHotelGeneral,addHotelRoom, addHotelStaff, addBulkHotelRooms, addBulkHotelStaff } =
    useAddHotel();
    const searchParams = useSearchParams();
  const [hotel, setHotel] = useState<CompleteHotel>();
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [cities, setCities] = useState<SelectCity[]>([]);
  const [customRoomCategories, setCustomRoomCategories] = useState<string[]>([]);
  const fetchedRef = useRef(false);
  const lookupsFetchedRef = useRef(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
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

    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchData();
  }, [id]);

  useEffect(() => {
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

  const onSubmitAll = async () => {
    try {
      if (!hotel) return;
      setSubmitLoading(true);

      const updatedHotelDetails = {
        ...hotel.hotel,
        ...hotelGeneral,
      };

      const response = await updateHotelAndRelatedData(
        hotel.hotel.id ?? "not found",
        updatedHotelDetails,
        hotelRooms,
        hotelStaff
      );

      if (!response) {
        throw new Error("Failed to update the hotel");
      }

      toast({ title: "Success", description: "Hotel updated successfully" });
      router.push("/dashboard/hotels");
    } catch (e) {
      console.error(e);
      toast({ title: "Uh Oh!", description: "Error while updating the hotel" });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleTabChange = (next: string) => {
    if (next === "general") {
      setActiveTab("general");
      return;
    }
    if (next === "rooms") {
      // basic guard: require mandatory general fields
      const required = [
        hotelGeneral.name,
        hotelGeneral.primaryEmail,
        hotelGeneral.primaryContactNumber,
        hotelGeneral.streetName,
        hotelGeneral.province,
      ];
      const starsOk = (hotelGeneral.stars ?? 0) > 0;
      if (required.some((v) => !v) || !starsOk) {
        toast({ title: "Incomplete general info", description: "Fill required general fields first" });
        return;
      }
      setActiveTab("rooms");
      return;
    }
    if (next === "staff") {
      if (hotelRooms.length === 0) {
        toast({ title: "Add rooms", description: "Please add at least one room" });
        return;
      }
      setActiveTab("staff");
      return;
    }
    if (next === "submit") {
      if (hotelStaff.length === 0) {
        toast({ title: "Add staff", description: "Please add at least one staff member" });
        return;
      }
      setActiveTab("submit");
      return;
    }
  };

  if(loading){
    return <div><LoadingLayout/></div>
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
                  onClick={() => handleTabChange("general")}
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
                  onClick={() => handleTabChange("rooms")}
                >
                  Rooms
                </TabsTrigger>
                <TabsTrigger
                  value="staff"
                  statusLabel={"Included"}
                  isCompleted={hotelStaff.length > 0}
                  inProgress={activeTab == "staff"}
                  disabled={hotelRooms.length == 0}
                  onClick={() => handleTabChange("staff")}
                >
                  Staff
                </TabsTrigger>
                <TabsTrigger
                  value="submit"
                  inProgress={activeTab == "submit"}
                  disabled={hotelStaff.length == 0}
                  onClick={() => handleTabChange("submit")}
                >
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
                <EditHotelSubmitView originalHotel={hotel ?? null} general={hotelGeneral as any} rooms={hotelRooms as any} staff={hotelStaff as any} onSubmit={onSubmitAll} loading={submitLoading} />
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
