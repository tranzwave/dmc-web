"use client";

import { Lock } from "lucide-react"; // Import the lock icon
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookingDTO,
  CategoryDetails
} from "~/components/bookings/home/columns";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { getActivityVouchers } from "~/server/db/queries/booking/activityVouchers";
import { getHotelVouchers } from "~/server/db/queries/booking/hotelVouchers";
import { getCoordinatorAndManager, getRestaurantVouchers } from "~/server/db/queries/booking/restaurantVouchers";
import { getShopsVouchers } from "~/server/db/queries/booking/shopsVouchers";
import { getTransportVouchers } from "~/server/db/queries/booking/transportVouchers";
import { SelectUser } from "~/server/db/schemaTypes";
import { HotelVoucherData } from "../../tasks/hotelsTaskTab";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Organization } from "@clerk/backend";
import { OrganizationMembershipResource, UserResource } from "@clerk/types";
import { set } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import TourPacketCheckList from "./tourPacketCheckList";
import { TourPacket } from "~/lib/types/booking";
import { updateTourPacketList } from "~/server/db/queries/booking";
import LoadingLayout from "~/components/common/dashboardLoading";
import TourPacketCheckListPDF from "./tourPacketCheckListDocument";

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
  const [coordinatorAndManager, setCoordinatorAndManager] = useState<string[]>(['init-c', 'init-m'])
  const [members, setMembers] = useState<OrganizationMembershipResource[]>([]); // Correct type for members
  const [showTourPacket, setShowTourPacket] = useState(false);

  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded, user } = useUser();



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

      if (!coordinatorAndManagerResponse) {
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

  const onTourPacketClick = () => {
    setShowTourPacket(true);
  }

  const fetchMembers = async () => {
    if (organization) {
      try {
        setLoading(true);
        const memberships = await organization.getMemberships();
        setMembers(memberships.data); // Set the 'items' array containing memberships
        console.log(memberships);
        setLoading(false);
        console.log(memberships)
        if (memberships && booking) {
          const coordinator = memberships?.data?.find(m => m.publicUserData.userId === booking.booking.coordinatorId)
          const manager = memberships?.data?.find(m => m.id === booking.booking.managerId)
          console.log({ coordinator: coordinator, manager: manager })

          const coordinatorFullName = coordinator ? `${coordinator.publicUserData.firstName} ${coordinator.publicUserData.lastName}` : ''
          const managerFullName = manager ? `${manager.publicUserData.firstName} ${manager.publicUserData.lastName}` : ''

          setCoordinatorAndManager([coordinatorFullName, managerFullName])
        }

      } catch (error) {
        console.error("Error fetching members:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    if (isLoaded && booking) {
      fetchMembers();

    }

  }, [booking]);

  if (!booking)
    return (
      <div className="flex items-center justify-center">
        Please click on a row
      </div>
    );

  if (loading || !isLoaded || !isOrgLoaded) return <div>Loading...</div>;



  const getStatusesCount = (voucherList: any[]) => {
    return {
      inprogress: voucherList.filter(v => v.status == 'inprogress').length,
      sentToVendor: voucherList.filter(v => v.status == 'sentToVendor').length,
      vendorConfirmed: voucherList.filter(v => v.status == 'vendorConfirmed').length,
      sentToClient: voucherList.filter(v => v.status == 'sentToClient').length,
      amended: voucherList.filter(v => v.status == 'amended').length,
      confirmed: voucherList.filter(v => v.status == 'confirmed').length,
      cancelled: voucherList.filter(v => v.status == 'cancelled').length

    }
  }
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
              {`${category.totalVouchers !== 0 ? `${category.statusCount.inprogress}/` : ''}${category.totalVouchers} vouchers to be finalized`}
            </div>
            <div>
              <Progress
                value={category.totalVouchers !== 0 ? (((category.totalVouchers - category.statusCount.inprogress) / category.totalVouchers) * 100) : 0}
                className="h-2"
              />
            </div>
          </div>
          <div>
            <div className="text-sm font-normal text-[#21272A]">
              {`${category.totalVouchers !== 0 ? `${category.totalVouchers - category.statusCount.vendorConfirmed}/` : ''}${category.totalVouchers} vouchers to be confirmed by vendor`}
            </div>
            <div>
              <Progress
                value={category.totalVouchers !== 0 ? ((category.statusCount.vendorConfirmed / category.totalVouchers) * 100) : 0}
                className="h-2"
              />
            </div>
          </div>
        </div>
        <div className="xl::w-1/5 xs:2/5 ml-2">
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
          <div className="text-xs text-neutral-500">{`Coordinator - ${coordinatorAndManager[0]} | Manager - ${coordinatorAndManager[1]}`}</div>
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
        statusCount: getStatusesCount(hotelVouchers),
      })}
      {renderCard({
        title: "Restaurants",
        totalVouchers: restaurantVouchers?.length ?? 0,
        done: 0,
        locked: booking.includes?.restaurants ? false : true,
        statusCount: getStatusesCount(restaurantVouchers),
      })}
      {renderCard({
        title: "Transport",
        totalVouchers: transportVouchers?.length ?? 0,
        done: 0,
        locked: booking.includes?.transport ? false : true,
        statusCount: getStatusesCount(transportVouchers),
      })}
      {renderCard({
        title: "Activities",
        totalVouchers: activityVouchers?.length ?? 0,
        done: 0,
        locked: booking.includes?.activities ? false : true,
        statusCount: getStatusesCount(activityVouchers),
      })}
      {renderCard({
        title: "Shops",
        totalVouchers: shopVouchers?.length ?? 0,
        done: 0,
        locked: booking.includes?.shops ? false : true,
        statusCount: getStatusesCount(shopVouchers),
      })}
      <Button
        variant={"primaryGreen"}
        onClick={onTourPacketClick}
        className="w-full"
      >Tour Packet - Check List</Button>
      <Dialog open={showTourPacket} onOpenChange={setShowTourPacket} >
        <DialogContent className="max-w-fit max-h-[90%] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Tour Packet - Check List | {booking.id}</DialogTitle>
            <DialogDescription>
              You can add or remove documents and accessories from the tour packet
            </DialogDescription>
          </DialogHeader>
          <div>
            {!booking.tourPacket && (
              <div className="flex items-center justify-center">
                Loading...
              </div>
            )}
            {booking !== null && organization && user && (
              <div>
                <TourPacketCheckList organization={organization} user={user as UserResource} bookingData={booking}/>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SidePanel;
