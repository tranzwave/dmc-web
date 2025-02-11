"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ActivitiesTasksTab from "~/components/bookings/tasks/activities";
import HotelsTasksTab from "~/components/bookings/tasks/hotelsTaskTab";
import RestaurantsTasksTab from "~/components/bookings/tasks/restaurants";
import ShopsTasksTab from "~/components/bookings/tasks/shops";
import TransportTasksTab from "~/components/bookings/tasks/transport";
import TitleBar from "~/components/common/titleBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BookingLineWithAllData, VoucherSettings } from "~/lib/types/booking";
import { getBookingLineWithAllData } from "~/server/db/queries/booking";
import { SelectBookingLine } from "~/server/db/schemaTypes";
import { AddBookingProvider } from "../../add/context";

const Page = ({ params }: { params: { id: string } }) => {
  const pathname = usePathname();
  const [booking, setBooking] = useState<SelectBookingLine>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLine, setBookingLine] = useState<BookingLineWithAllData>();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [voucherSettings, setVoucherSettings] = useState<VoucherSettings | null>(null)

  // Fetch the booking details when the component mounts
  const fetchBooking = async () => {
    setLoading(true);
    try {
      const bookingLineData = await getBookingLineWithAllData(params.id);
      console.log(bookingLineData);
      if (!bookingLineData) {
        setError("Booking not found");
      }
      setBookingLine(bookingLineData as BookingLineWithAllData);

      //Get voucher settings from local storage
      const voucherSettingsLocal = localStorage.getItem("voucherSettings");
      if (voucherSettingsLocal) {
        console.log("Voucher settings already set: ", JSON.parse(voucherSettingsLocal ?? "{}"));
        setVoucherSettings(JSON.parse(voucherSettingsLocal ?? "{}"));
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!bookingLine) {
    return <div>No booking details available</div>;
  }

  return (
    <AddBookingProvider>
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title={`${bookingLine.id} - Tasks`} link="toAddBooking" />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
          </div>
          <div className="w-full">
            <Tabs defaultValue={tab ?? "hotels"} className="w-full border">
              <TabsList className="flex w-full justify-evenly">
                {/* <TabsTrigger value="general">General</TabsTrigger> */}
                <TabsTrigger
                  value="hotels"
                  statusLabel={
                    bookingLine.includes?.hotels ? "Mandatory" : "Locked"
                  }
                  disabled={!bookingLine.includes?.hotels}
                  isCompleted={bookingLine.includes?.hotels}

                >
                  Hotels
                </TabsTrigger>
                <TabsTrigger
                  value="restaurants"
                  statusLabel={
                    bookingLine.includes?.restaurants ? "Mandatory" : "Locked"
                  }
                  disabled={!bookingLine.includes?.restaurants}
                  isCompleted={bookingLine.includes?.restaurants}

                >
                  Restaurants
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  statusLabel={
                    bookingLine.includes?.activities ? "Mandatory" : "Locked"
                  }
                  disabled={!bookingLine.includes?.activities}
                  isCompleted={bookingLine.includes?.activities}
                >
                  Activities
                </TabsTrigger>
                <TabsTrigger
                  value="transport"
                  statusLabel={
                    bookingLine.includes?.transport ? "Mandatory" : "Locked"
                  }
                  isCompleted={bookingLine.includes?.transport}
                  disabled={!bookingLine.includes?.transport}
                >
                  Transport
                </TabsTrigger>
                <TabsTrigger
                  value="shops"
                  statusLabel={
                    bookingLine.includes?.shops ? "Mandatory" : "Locked"
                  }
                  disabled ={!bookingLine.includes?.shops}
                  isCompleted ={bookingLine.includes?.shops}

                >
                  Shops
                </TabsTrigger>
              </TabsList>
              {/* <TabsContent value="general"> */}
              {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
              {/* General Task View */}
              {/* </TabsContent> */}
              <TabsContent value="hotels">
                {/* <HotelsTab onAddHotel={addHotel} /> */}
                <HotelsTasksTab
                  bookingLineId={params.id}
                  vouchers={bookingLine?.hotelVouchers ?? []}
                  currency = {voucherSettings?.hotelVoucherCurrency ?? ""}
                />
                {/* <HotelsTasksTab bookingLineId={params.id}/> */}
              </TabsContent>
              <TabsContent value="restaurants">
                {/* <RestaurantsTab onAddRestaurant={addRestaurant} /> */}
                <RestaurantsTasksTab
                  bookingLineId={params.id}
                  vouchers={bookingLine?.restaurantVouchers ?? []}
                  currency={voucherSettings?.restaurantVoucherCurrency ?? ""}
                />
              </TabsContent>
              <TabsContent value="activities">
                {/* <ActivitiesTab onAddActivity={addActivity} /> */}
                <ActivitiesTasksTab
                  bookingLineId={params.id}
                  vouchers={bookingLine?.activityVouchers ?? []}
                />
              </TabsContent>
              <TabsContent value="transport">
                {/* <TransportTab onAddTransport={addTransport} /> */}
                <TransportTasksTab
                  bookingLineId={params.id}
                  bookingData={bookingLine}
                  vouchers={bookingLine?.transportVouchers.map(t => {
                    const { driver,guide,otherTransport,driverVoucherLines, guideVoucherLines, otherTransportVoucherLines, ...voucher } = t;
                    return {
                      voucher: voucher,
                      driver: driver,
                      guide: guide,
                      otherTransport: otherTransport,
                      driverVoucherLine: driver ? driverVoucherLines[0] : null,
                      guideVoucherLine: guide ? guideVoucherLines[0] : null,
                      otherTransportVoucherLine: otherTransport ? otherTransportVoucherLines[0] : null
                    }
                  }) ?? []}
                />
              </TabsContent>
              <TabsContent value="shops">
                <ShopsTasksTab
                  bookingLineId={params.id}
                  vouchers={bookingLine?.shopsVouchers ?? []}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
    </AddBookingProvider>
  );
};

export default Page;
