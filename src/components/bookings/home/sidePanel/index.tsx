"use client";

import {
  Booking,
  BookingDTO,
  CategoryDetails,
} from "~/components/bookings/home/columns";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Lock } from "lucide-react"; // Import the lock icon
import { useEffect, useState } from "react";
import { getHotelVouchers } from "~/server/db/queries/booking/hotelVouchers";
import { getTransportVouchers } from "~/server/db/queries/booking/transportVouchers";
import { getActivityVouchers } from "~/server/db/queries/booking/activityVouchers";
import { getShopsVouchers } from "~/server/db/queries/booking/shopsVouchers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCoordinatorAndManager, getRestaurantVouchers } from "~/server/db/queries/booking/restaurantVouchers";
import { HotelVoucherData } from "../../tasks/hotelsTaskTab";
import { SelectUser } from "~/server/db/schemaTypes";

interface SidePanelProps {
  booking: BookingDTO | null;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ booking, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [errorD, setError] = useState<string>();
  const [hotelVouchers, setHotelVouchers] = useState<HotelVoucherData[]>([]);
  const [transportVouchers, setTransportVouchers] = useState<any[]>([]);
  const [activityVouchers, setActivityVouchers] = useState<any[]>([]);
  const [shopVouchers, setShopVouchers] = useState<any[]>([]);
  const [restaurantVouchers, setRestaurantVouchers] = useState<any[]>([]);
  const [coordinatorAndManager, setCoordinatorAndManager] = useState<SelectUser[]>([])

  const pathname = usePathname();
  const fetchData = async () => {
    try {
      // Run both requests in parallel
      setLoading(true);
      if (!booking) {
        console.log("Error fetching booking vouchers");
        throw new Error("Can't fetch the booking");
      }
      const [
        hotelVoucherResponse,
        transportVoucherResponse,
        activityVoucherResponse,
        shopVoucherResponse,
        restaurantVoucherResponse,
        coordinatorAndManagerResponse,
      ] = await Promise.all([
        getHotelVouchers(booking?.id),
        getTransportVouchers(booking?.id),
        getActivityVouchers(booking?.id),
        getShopsVouchers(booking?.id),
        getRestaurantVouchers(booking?.id),
        getCoordinatorAndManager(booking?.booking.coordinatorId, booking?.booking.managerId)
      ]);

      // Check for errors in the responses
      if (!hotelVoucherResponse) {
        console.log("Error fetching hotel vouchers");
        throw new Error("Error fetching hotel vouchers");
      }

      if (!transportVoucherResponse) {
        console.log("Error fetching transport vouchers");
        throw new Error("Error fetching transport vouchers");
      }

      if (!activityVoucherResponse) {
        console.log("Error fetching activity vouchers");
        throw new Error("Error fetching activity vouchers");
      }

      if (!shopVoucherResponse) {
        console.log("Error fetching shops vouchers");
        throw new Error("Error fetching shops vouchers");
      }

      if (!restaurantVoucherResponse) {
        console.log("Error fetching restaurant vouchers");
        throw new Error("Error fetching restaurant vouchers");
      }

      if(!coordinatorAndManagerResponse) {
        throw new Error("Couldn't find the coordinator")
      }

      console.log("Fetched Agents:", hotelVoucherResponse);
      // console.log("Fetched Users:", usersResponse);
      // console.log("Fetched Users:", countriesResponse);

      // Set states after successful fetch
      setHotelVouchers(hotelVoucherResponse);
      setTransportVouchers(transportVoucherResponse);
      setActivityVouchers(activityVoucherResponse);
      setShopVouchers(shopVoucherResponse);
      setRestaurantVouchers(restaurantVoucherResponse);
      setCoordinatorAndManager(coordinatorAndManagerResponse)
      // setUsers(usersResponse);
      // setCountries(countriesResponse);

      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [booking]);

  if (!booking)
    return (
      <div className="flex items-center justify-center">
        Please click on a row
      </div>
    );

  if (loading) return <div>Loading...</div>;

  const renderCard = (category: CategoryDetails) => (
    <div className="card relative gap-3">
      <div className="flex flex-row justify-between">
        <div className="text-base font-semibold text-primary-black">
          {category.title}
        </div>
        <Link
          href={`${pathname}/${booking.id}/edit?tab=${category.title.toLowerCase()}`}
        >
          <Button variant={"outline"}>Add Vouchers</Button>
        </Link>
      </div>
      <div className="flex flex-row gap-3">
        <div className="flex w-4/5 flex-col gap-4">
          <div>
            <div className="text-sm font-normal text-[#21272A]">
              {category.vouchersToFinalize} Vouchers to finalize
            </div>
            <div>
              <Progress
                value={(category.done / category.totalVouchers) * 100}
                className="h-2"
              />
            </div>
          </div>
          <div>
            <div className="text-sm font-normal text-[#21272A]">
              {category.done} done | {category.totalVouchers - category.done}{" "}
              vouchers to confirm
            </div>
            <div>
              <Progress
                value={(category.done / category.totalVouchers) * 100}
                className="h-2"
              />
            </div>
          </div>
        </div>
        <div className="w-1/5 ml-2">
          <div className="flex h-full items-end justify-end">
            <Link
              href={`${pathname}/${booking.id}/tasks?tab=${category.title.toLowerCase()}`}
            >
              <Button variant={"outline"}>Send Vouchers</Button>
            </Link>
          </div>
        </div>
      </div>
      {category.locked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-700 bg-opacity-50">
          <Lock className="text-white" size={32} />
        </div>
      )}
    </div>
  );

  return (
    <div className="card h-auto w-full gap-4 rounded-lg border border-primary-borderGray shadow-md">
      <div className="flex flex-row items-center justify-between">
        <div>
        <div className="card-title">Booking - {booking.id}</div>
        <div className="text-xs text-neutral-500">{`Coordinator - ${coordinatorAndManager[0]?.name ?? ""} | Manager - ${coordinatorAndManager[0]?.name ?? ""}`}</div>
        </div>

        <Link href={`${pathname}/${booking.id}/edit?tab=submit`}>
          <Button variant={"primaryGreen"}>Summary</Button>
        </Link>
      </div>
      <div className="grid grid-cols-3 rounded-lg shadow-sm">
        <div></div>
      </div>
      {renderCard({
        title: "Hotels",
        totalVouchers: hotelVouchers?.length ?? 0,
        done: 0,
        locked: booking.includes?.hotels ? false : true,
        vouchersToFinalize: hotelVouchers?.length ?? 0,
      })}
      {renderCard({
        title: "Restaurants",
        totalVouchers: restaurantVouchers?.length ?? 0,
        done: 0,
        locked: booking.includes?.restaurants ? false : true,
        vouchersToFinalize: restaurantVouchers?.length ?? 0,
      })}
      {renderCard({
        title: "Transport",
        totalVouchers: transportVouchers?.length ?? 0,
        done: 0,
        locked: booking.includes?.transport ? false : true,
        vouchersToFinalize: transportVouchers?.length ?? 0,
      })}
      {renderCard({
        title: "Activities",
        totalVouchers: activityVouchers?.length ?? 0,
        done: 0,
        locked: booking.includes?.activities ? false : true,
        vouchersToFinalize: activityVouchers?.length ?? 0,
      })}
      {renderCard({
        title: "Shops",
        totalVouchers: shopVouchers?.length ?? 0,
        done: 0,
        locked: booking.includes?.shops ? false : true,
        vouchersToFinalize: shopVouchers?.length ?? 0,
      })}
      {/* {renderCard(booking.details.transport)}
      {renderCard(booking.details.activities)}
      {renderCard(booking.details.shops)} */}
    </div>
  );
};

export default SidePanel;
