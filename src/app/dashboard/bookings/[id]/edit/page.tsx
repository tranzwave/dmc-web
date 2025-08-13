"use client";
import { format } from 'date-fns';
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ActivitiesTab from "~/components/bookings/editBooking/forms/activitiesForm";
import GeneralTab from "~/components/bookings/editBooking/forms/generalForm";
import HotelsTab from "~/components/bookings/editBooking/forms/hotelsForm";
import RestaurantsTab from "~/components/bookings/editBooking/forms/restaurantsForm";
import ShopsTab from "~/components/bookings/editBooking/forms/shopsForm";
import AddBookingSubmitTab from "~/components/bookings/editBooking/forms/submitForm";
import TransportTab from "~/components/bookings/editBooking/forms/transportForm";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getBookingLineWithAllData } from "~/server/db/queries/booking";
import { EditBookingProvider, TransportVoucher, useEditBooking } from "./context";
import { PartialClerkUser } from '~/lib/types/marketingTeam';
import { useOrganization } from '@clerk/nextjs';
import { SelectMarketingTeam } from '~/server/db/schemaTypes';
import { getAllClerkUsersByOrgId } from '~/server/auth';
import { getAllMarketingTeams } from '~/server/db/queries/marketingTeams';
import { useUserPermissions } from '~/app/dashboard/context';
import UnauthorizedCard from '~/components/common/unauthorized';

const EditBooking = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabToEdit = searchParams.get("tab")
  const {
    setGeneralDetails,
    addHotelVoucher,
    addHotelVouchers,
    addRestaurantVoucher,
    addRestaurantVouchers,
    addActivity,
    addActivityVouchers,
    addTransport,
    addTransportVouchers,
    addShop,
    addShopVouchers,
    activeTab,
    setActiveTab,
    bookingDetails,
    statusLabels,
    setStatusLabels,
    triggerRefetch
  } = useEditBooking();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneralDetailsSet, setIsGeneralDetailsSet] = useState<boolean>(false);
  const [isBookingCancelled, setIsBookingCancelled] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<PartialClerkUser[]>([]);
  const { organization, isLoaded } = useOrganization();
  const [marketingTeams, setMarketingTeams] = useState<SelectMarketingTeam[]>([]);
  const permissions = useUserPermissions();

  const router = useRouter()

  const fetchBookingLine = async () => {
    try {
      setLoading(true)
      const selectedBookingLine = await getBookingLineWithAllData(id)


      if (!selectedBookingLine) {
        throw new Error("Couldn't find booking line");
      }

      console.log(selectedBookingLine)

      if (selectedBookingLine.status === "cancelled") {
        setIsBookingCancelled(true);
      }

      const { booking, hotelVouchers, restaurantVouchers, transportVouchers, activityVouchers, shopsVouchers, ...general } = selectedBookingLine;
      // console.log(booking, hotelVouchers,restaurantVouchers,transportVouchers,activityVouchers, shopsVouchers, general)
      console.log(selectedBookingLine)

      setGeneralDetails({
        clientName: booking.client.name,
        adultsCount: general.adultsCount,
        kidsCount: general.kidsCount,
        directCustomer: booking.directCustomer ?? false,
        primaryContactNumber: booking.client.primaryContactNumber ?? '',
        agent: booking.bookingAgent ? booking.bookingAgent.agent.id : '',
        country: booking.client.country,
        primaryEmail: booking.client.primaryEmail ?? '',
        startDate: format(new Date(general.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(general.endDate), 'yyyy-MM-dd'),
        includes: {
          activities: general.includes?.activities ?? false,
          hotels: general.includes?.hotels ?? false,
          restaurants: general.includes?.restaurants ?? false,
          shops: general.includes?.shops ?? false,
          transport: general.includes?.transport ?? false
        },
        marketingManager: booking.managerId,
        marketingTeam: booking.marketingTeamId ?? undefined,
        numberOfDays: 7,
        tourType: booking.tourType
      })

      setStatusLabels({
        hotels: general.includes?.hotels ? "Included" : "Not Included",
        restaurants: general.includes?.restaurants ? "Included" : "Not Included",
        transport: general.includes?.transport ? "Included" : "Not Included",
        activities: general.includes?.activities ? "Included" : "Not Included",
        shops: general.includes?.shops ? "Included" : "Not Included"
      })

      if (hotelVouchers) {
        const vouchers = hotelVouchers.map(v => {
          const { hotel, voucherLines, ...voucher } = v
          return {
            hotel: hotel,
            voucher: voucher,
            voucherLines: voucherLines
          }
        })
        console.log(hotelVouchers)
        addHotelVouchers(vouchers);
      }

      if (restaurantVouchers) {
        const vouchers = restaurantVouchers.map(v => {
          const { restaurant, voucherLines, ...voucher } = v
          return {
            restaurant: restaurant ?? (() => { throw new Error("Restaurant is null. Might have been deleted") })(),
            voucher: voucher,
            voucherLines: voucherLines
          }
        })

        console.log(vouchers)
        addRestaurantVouchers(vouchers)
      }

      if (activityVouchers) {
        const vouchers = activityVouchers.map(v => {
          const { activity, activityVendor, ...voucher } = v
          return {
            vendor: activityVendor,
            voucher: voucher,
          }
        })

        console.log(vouchers)
        addActivityVouchers(vouchers)
      }

      if (transportVouchers) {
        const vouchers: TransportVoucher[] = transportVouchers.map((v) => {
          const { driver, guide, otherTransport, otherTransportVoucherLines, guideVoucherLines, ...voucher } = v;

          const driverVoucherLine = v.driverVoucherLines && v.driverVoucherLines.length > 0
            ? v.driverVoucherLines[0]
            : undefined;

          const guideVoucherLine = guideVoucherLines && guideVoucherLines.length > 0
            ? guideVoucherLines[0]
            : undefined;

          const otherTransportVoucherLine = otherTransportVoucherLines && otherTransportVoucherLines.length > 0
            ? otherTransportVoucherLines[0]
            : undefined;

          return {
            driver: driver ?? null,
            guide: guide ?? null,
            otherTransport: otherTransport ?? null,
            otherTransportVoucherLine: otherTransportVoucherLine ?? null,
            driverVoucherLine: driverVoucherLine ?? undefined,
            guideVoucherLine: guideVoucherLine ?? undefined,
            voucher,
          };
        });

        console.log(vouchers);
        addTransportVouchers(vouchers as TransportVoucher[]);
      }



      if (shopsVouchers) {
        const vouchers = shopsVouchers.map(v => {
          const { shop, ...voucher } = v
          return {
            shop: shop,
            voucher: voucher,
          }
        })

        console.log(vouchers)
        addShopVouchers(vouchers)
      }
      setLoading(false);
      setTimeout(() => {
        console.log("This message is logged after 3 seconds");
        setIsGeneralDetailsSet(true);
        console.log(bookingDetails.vouchers)
      }, 3000);
    } catch (error) {
      console.error("Failed to fetch driver details:", error);
      setError("Failed to load driver details.");
      setLoading(false);
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.replace(`${pathname}?tab=${tab}`);
  };


  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        // Fetch all users
        if (!organization) {
          return
        }
        const users = await getAllClerkUsersByOrgId(organization.id);
        setAllUsers(users);
        const marketingTeamsResponse = await getAllMarketingTeams(organization.id);
        setMarketingTeams(marketingTeamsResponse);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    }
    console.log("Add Booking Component");
    fetchAllUsers();
  }, []);

  useEffect(() => {
    fetchBookingLine();
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [id, triggerRefetch]);


  useEffect(() => {
    console.log("Tab to edit:", tabToEdit);
    console.log("Active tab before setting:", activeTab);
    if (tabToEdit) {
      setActiveTab(tabToEdit);
    } else {
      setActiveTab("general");
    }
  }, [tabToEdit, setActiveTab]);

  if (loading) {
    return <div> <LoadingLayout /></div>
  }

  if (isBookingCancelled) {
    return (
      <div>
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Edit Booking" link="toeditBooking" />
          </div>
          <div className="w-full">
            <div className="text-red-500">This booking has been cancelled. You can't edit a cancelled booking.</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Edit Booking" link="toeditBooking" />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
          </div>
          <div className="w-full">
            <Tabs
              defaultValue="general"
              className="w-full"
              value={activeTab}
            >
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger
                  value="general"
                  onClick={() => {
                    handleTabChange("general");
                  }}
                  isCompleted={false}
                  inProgress={activeTab == "general"}
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="hotels"
                  onClick={() => {
                    handleTabChange("hotels");
                  }}
                  disabled={!bookingDetails.general.includes.hotels}
                  statusLabel={statusLabels.hotels}
                  isCompleted={bookingDetails.vouchers.length > 0}
                  inProgress={activeTab == "hotels"}
                >
                  Hotels
                </TabsTrigger>
                <TabsTrigger
                  value="restaurants"
                  onClick={() => {
                    // router.push(`${pathname}?tab=${"restaurants"}`)
                    handleTabChange("restaurants");
                  }}
                  disabled={!bookingDetails.general.includes.hotels}
                  statusLabel={statusLabels.restaurants}
                  isCompleted={bookingDetails.restaurants.length > 0}
                  inProgress={activeTab == "restaurants"}
                >
                  Restaurants
                </TabsTrigger>
                <TabsTrigger
                  value="transport"
                  onClick={
                    () => {
                      // router.push(`${pathname}?tab=${"transport"}`)
                      handleTabChange("transport");
                    }
                  }
                  disabled={!bookingDetails.general.includes.transport}
                  statusLabel={statusLabels.transport}
                  isCompleted={bookingDetails.transport.length > 0}
                  inProgress={activeTab == "transport"}
                >
                  Transport
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  onClick={() => {
                    handleTabChange("activities");
                  }}
                  disabled={!bookingDetails.general.includes.activities}
                  statusLabel={statusLabels.activities}
                  isCompleted={bookingDetails.activities.length > 0}
                  inProgress={activeTab == "activities"}
                >
                  Activities
                </TabsTrigger>

                <TabsTrigger
                  value="shops"
                  onClick={() => {
                    handleTabChange("shops");
                  }}
                  disabled={!bookingDetails.general.includes.shops}
                  statusLabel={statusLabels.shops}
                  isCompleted={bookingDetails.shops.length > 0}
                  inProgress={activeTab == "shops"}
                >
                  Shops
                </TabsTrigger>
                <TabsTrigger
                  value="submit"
                  onClick={() => handleTabChange("submit")}
                  disabled={!bookingDetails.general.clientName}
                  isCompleted={false}
                  inProgress={activeTab == "submit"}
                >
                  Itinerary
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general" forceMount={true} hidden={activeTab !== "general" || loading}>
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                {isGeneralDetailsSet ?
                  permissions.includes("booking_general_info:manage") ?
                    <GeneralTab allUsers={allUsers} marketingTeams={marketingTeams} />
                    : <UnauthorizedCard activity={"manage booking"} requiredPermissions={
                      ["booking_general_info:manage"]
                    } />
                  : <div>Loading General Details...</div>}
              </TabsContent>
              <TabsContent value="hotels" forceMount={true} hidden={activeTab !== "hotels" || loading}>
                {/* <HotelsTab onAddHotel={addHotel} /> */}
                {permissions.includes("booking_hotel:manage") ? <HotelsTab /> :
                  <UnauthorizedCard
                    activity={"manage hotels"}
                    requiredPermissions={["booking_hotel:manage"]}
                  />}
              </TabsContent>
              <TabsContent value="restaurants" forceMount={true} hidden={activeTab !== "restaurants" || loading}>
                {permissions.includes("booking_rest:manage") ? <RestaurantsTab /> : <UnauthorizedCard activity={"manage restaurants"}
                  requiredPermissions={
                    ["booking_rest:manage"]
                  } />}
              </TabsContent>
              <TabsContent value="activities" forceMount={true} hidden={activeTab !== "activities" || loading}>
                {permissions.includes("booking_activity:manage") ? <ActivitiesTab /> : <UnauthorizedCard activity={"manage activities"}
                  requiredPermissions={
                    ["booking_activity:manage"]
                  } />}
              </TabsContent>
              <TabsContent value="transport" forceMount={true} hidden={activeTab !== "transport" || loading}>
                {permissions.includes("booking_transport:manage") ? <TransportTab /> : <UnauthorizedCard activity={"manage transport"}
                  requiredPermissions={
                    ["booking_transport:manage"]
                  } />}
              </TabsContent>
              <TabsContent value="shops" forceMount={true} hidden={activeTab !== "shops" || loading}>
                {permissions.includes("booking_shops:manage") ? <ShopsTab /> : <UnauthorizedCard activity={"manage shops"}
                  requiredPermissions={
                    ["booking_shops:manage"]
                  } />}
              </TabsContent>
              <TabsContent value="submit" forceMount={true} hidden={activeTab !== "submit" || loading}>
                {permissions.includes("booking:read") ? <AddBookingSubmitTab /> : <UnauthorizedCard activity={"view itinerary"}
                  requiredPermissions={
                    ["booking:read"]
                  } />}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedAddBooking() {
  const { id } = useParams();
  return (
    <EditBookingProvider>
      {id ? <EditBooking id={id as string} /> : <div>No booking ID provided.</div>}
    </EditBookingProvider>
  );
}
