"use client";

import { LoaderCircle, Lock } from "lucide-react"; // Import the lock icon
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
import { SelectMarketingTeam, SelectUser } from "~/server/db/schemaTypes";
import { HotelVoucherData } from "../../tasks/hotelsTaskTab";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { Organization } from "@clerk/backend";
import { OrganizationMembershipResource, UserResource } from "@clerk/types";
import { set } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import TourPacketCheckList from "./tourPacketCheckList";
import { TourPacket } from "~/lib/types/booking";
import { cancelBookingLine, updateBookingLine, updateTourPacketList } from "~/server/db/queries/booking";
import LoadingLayout from "~/components/common/dashboardLoading";
import TourPacketCheckListPDF from "./tourPacketCheckListDocument";
import TourInvoiceModal from "./proformaInvoice/tourInvoiceModal";
import TourInvoiceModalTrigger from "./proformaInvoice/tourInvoiceModalTrigger";
import { Badge } from "~/components/ui/badge";
import AssignTeamModal from "./assignTeamModal";
import { getAllMarketingTeams } from "~/server/db/queries/marketingTeams";
import { toast } from "~/hooks/use-toast";
import RenderCard from "./voucherCard";
import { hotel } from "~/server/db/schema";

interface SidePanelProps {
  booking: BookingDTO | null;
}

const SidePanel: React.FC<SidePanelProps> = ({ booking }) => {
  const [loading, setLoading] = useState(false);
  const [errorD, setError] = useState<string>();
  const [hotelVouchers, setHotelVouchers] = useState<HotelVoucherData[] | null>(null);
  const [transportVouchers, setTransportVouchers] = useState<any[] | null>(null);
  const [activityVouchers, setActivityVouchers] = useState<any[] | null>(null);
  const [shopVouchers, setShopVouchers] = useState<any[] | null>(null);
  const [restaurantVouchers, setRestaurantVouchers] = useState<any[] | null>(null);
  const [coordinatorAndManager, setCoordinatorAndManager] = useState<string[]>(['init-c', 'init-m'])
  const [members, setMembers] = useState<OrganizationMembershipResource[]>([]); // Correct type for members
  const [showTourPacket, setShowTourPacket] = useState(false);
  const [showTourInvoice, setShowTourInvoice] = useState(false);
  const [isAssignTeamModalOpen, setIsAssignTeamModalOpen] = useState(false);
  const [marketingTeams, setMarketingTeams] = useState<SelectMarketingTeam[]>([]);
  const [showCancelBooking, setShowCancelBooking] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded, user } = useUser();
  const { orgRole, isLoaded: isAuthLoaded } = useAuth();
  const [reasonToCancel, setReasonToCancel] = useState<string>('Whole booking cancelled');



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
      setHotelVouchers(hotelVoucherResponse);

      if (!transportVoucherResponse) {
        console.log("Error fetching transport vouchers");
        throw new Error("Error fetching transport vouchers");
      }
      setTransportVouchers(transportVoucherResponse);

      if (!activityVoucherResponse) {
        console.log("Error fetching activity vouchers");
        throw new Error("Error fetching activity vouchers");
      }
      setActivityVouchers(activityVoucherResponse);

      if (!shopVoucherResponse) {
        console.log("Error fetching shops vouchers");
        throw new Error("Error fetching shops vouchers");
      }
      setShopVouchers(shopVoucherResponse);

      if (!restaurantVoucherResponse) {
        console.log("Error fetching restaurant vouchers");
        throw new Error("Error fetching restaurant vouchers");
      }
      setRestaurantVouchers(restaurantVoucherResponse);

      if (!coordinatorAndManagerResponse) {
        throw new Error("Couldn't find the coordinator")
      }

      console.log("Fetched Agents:", hotelVoucherResponse);
      // setLoading(false);


    } catch (error) {
      // alert("Error fetching data in sidepanel");
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error fetching data in sidepanel:", error);
      setLoading(false);
    }
  };

  const onTourPacketClick = () => {
    setShowTourPacket(true);
  }

  const onTourInvoiceClick = () => {
    setShowTourInvoice(true);
  }

  const onCancelBooking = () => {
    setShowCancelBooking(true);
  }

  const cancelBooking = async () => {
    if (booking && hotelVouchers && restaurantVouchers && transportVouchers && activityVouchers && shopVouchers) {
      try {
        setIsCancelling(true);
        const updatedBooking = await cancelBookingLine(
          booking.id,
          hotelVouchers.map(v => v.id),
          restaurantVouchers.map(v => v.id),
          transportVouchers.map(v => v.id),
          activityVouchers.map(v => v.id),
          shopVouchers.map(v => v.id),
          reasonToCancel
        );

        console.log(updatedBooking);
        setIsCancelling(false);
        toast({
          title: "Booking Cancelled",
          description: "The booking has been successfully cancelled"
        })
      } catch (error) {
        console.error("Error cancelling booking:", error);
        setIsCancelling(false);
        toast({
          title: "Error",
          description: "Error cancelling the booking"
        })
      }
    }
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
          const manager = memberships?.data?.find(m => m.id === booking.booking.managerId || m.publicUserData.userId === booking.booking.managerId)
          console.log({ coordinator: coordinator, manager: manager })

          const coordinatorFullName = coordinator ? `${coordinator.publicUserData.firstName} ${coordinator.publicUserData.lastName}` : ''
          const managerFullName = manager ? `${manager.publicUserData.firstName} ${manager.publicUserData.lastName}` : ''

          setCoordinatorAndManager([coordinatorFullName, managerFullName])
        }

        const marketingTeamsResponse = await getAllMarketingTeams(organization.id);

        console.log(marketingTeamsResponse);

        if (!marketingTeamsResponse) {
          throw new Error("Couldn't find any marketing teams");
        }

        setMarketingTeams(marketingTeamsResponse);

      } catch (error) {
        console.error("Error fetching members:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    if (isLoaded && booking) {
      fetchMembers();
    }

    setLoading(false);

  }, [booking]);

  if (!booking)
    return (
      <div className="flex items-center justify-center">
        Please click on a row
      </div>
    );

  if (loading || !isLoaded || !isOrgLoaded || !isAuthLoaded || !hotelVouchers || !restaurantVouchers || !transportVouchers || !activityVouchers || !shopVouchers) return (
    <div className="card h-auto w-full gap-4 rounded-lg border border-primary-borderGray shadow-md">
      <div className="flex flex-row items-center justify-between">
        <div>
          <div className="flex flex-row justify-start gap-3 items-center ">
            <div className="text-[15px] text-zinc-900 font-semibold">Booking - {booking.id}</div>
            <div>
              {booking.booking.marketingTeam ? (
                <Badge variant="default" className={`bg-primary-orange ${orgRole === 'org:admin' ? 'hover:cursor-pointer' : ''} text-[10px] 2xl:text-[13px]`}
                  onClick={orgRole === 'org:admin' ? () => setIsAssignTeamModalOpen(true) : () => { console.log("") }}
                >{booking.booking.marketingTeam.name}</Badge>
              ) : (
                <>
                  {orgRole === 'org:admin' && (
                    <>
                      <Badge variant="default" className="bg-primary-orange hover:cursor-pointer" onClick={() => setIsAssignTeamModalOpen(true)}>Assign to a team</Badge>
                    </>
                  )}
                </>
              )}

            </div>
          </div>
          <div className="text-[10px] 2xl:text-xs text-neutral-500">{`Coordinator - ${coordinatorAndManager[0]} | Manager - ${coordinatorAndManager[1]}`}</div>
        </div>

        <Link href={`${pathname}/${booking.id}/edit?tab=submit`}>
          <Button variant={"primaryGreen"}>Itinerary</Button>
        </Link>
      </div>
      <div>
        <LoadingLayout />
      </div>
    </div>
  );



  const getStatusesCount = (voucherList: any[]) => {
    console.log("voucherList", voucherList)
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
        <div className="text-base font-semibold text-primary-black flex flex-row gap-2">
          <div>
            {category.title}
          </div>
          <div className="text-sm font-normal text-[#21272A]">
            {category.totalVouchers > 0 && (
              <div>
                <Badge variant="default" className="bg-primary-green bg-opacity-60">{category.totalVouchers} Vouchers</Badge>

              </div>
            )}
          </div>
        </div>
        {booking.status !== 'cancelled' && (
          <Link
            href={`${pathname}/${booking.id}/edit?tab=${category.title.toLowerCase()}`}
          >
            <Button variant={"outline"}>Add Vouchers</Button>
          </Link>
        )}
      </div>
      <div className="flex flex-row gap-3">
        <div className="w-4/5 flex-grid grid-cols-2 gap-x-2 gap-y-2">
          {/* <div>
            <div className="text-sm font-normal text-[#21272A]">
              {`${category.totalVouchers !== 0 ? `${category.statusCount.inprogress}` : ''} vouchers to be sent to vendor`}
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
              {`${category.totalVouchers !== 0 ? `${category.totalVouchers - (category.statusCount.cancelled + category.statusCount.vendorConfirmed) }` : ''} vouchers to be confirmed by vendor`}
            </div>
            <div>
              <Progress
                value={category.totalVouchers !== 0 ? ((category.statusCount.vendorConfirmed / category.totalVouchers) * 100) : 0}
                className="h-2"
              />
            </div>
          </div> */}
          <Badge variant="default" className="bg-yellow-500 bg-opacity-60">{category.statusCount.inprogress + category.statusCount.amended} Inprogress</Badge>
          <Badge variant="default" className="bg-blue-500 bg-opacity-60">{category.statusCount.sentToClient} Sent to Vendor</Badge>
          <Badge variant="default" className="bg-green-500 bg-opacity-60">{category.statusCount.vendorConfirmed} Vendor Confirmed</Badge>
          <Badge variant="default" className="bg-red-500 bg-opacity-60">{category.statusCount.cancelled} Cancelled</Badge>
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
          <div className="flex flex-row justify-start gap-3 items-center ">
            <div className="text-[15px] text-zinc-900 font-semibold">Booking - {booking.id}</div>
            <div>
              {booking.booking.marketingTeam ? (
                <Badge variant="default" className={`bg-primary-orange ${orgRole === 'org:admin' ? 'hover:cursor-pointer' : ''} text-[10px] 2xl:text-[13px]`}
                  onClick={orgRole === 'org:admin' ? () => setIsAssignTeamModalOpen(true) : () => { console.log("") }}
                >{booking.booking.marketingTeam.name}</Badge>
              ) : (
                <>
                  {orgRole === 'org:admin' && (
                    <>
                      <Badge variant="default" className="bg-primary-orange hover:cursor-pointer" onClick={() => setIsAssignTeamModalOpen(true)}>Assign to a team</Badge>
                    </>
                  )}
                </>
              )}

            </div>
          </div>
          <div className="text-[10px] 2xl:text-xs text-neutral-500">{`Coordinator - ${coordinatorAndManager[0]} | Manager - ${coordinatorAndManager[1]}`}</div>
        </div>

        <Link href={`${pathname}/${booking.id}/edit?tab=submit`}>
          <Button variant={"primaryGreen"}>Itinerary</Button>
        </Link>
      </div>
      {booking && (
        <div className="flex flex-col gap-2">
          <RenderCard category={{
            title: "Hotel Vouchers",
            totalVouchers: hotelVouchers?.length ?? 0,
            locked: booking.includes?.hotels ? false : true,
            statusCount: getStatusesCount(hotelVouchers),
          }}
            pathname={pathname}
            booking={{ id: booking.id, status: booking.status ?? 'inprogress' }}
          />

          <RenderCard category={{
            title: "Restaurant Vouchers",
            totalVouchers: restaurantVouchers?.length ?? 0,
            locked: booking.includes?.restaurants ? false : true,
            statusCount: getStatusesCount(restaurantVouchers),
          }}
            pathname={pathname}
            booking={{ id: booking.id, status: booking.status ?? 'inprogress' }}
          />

          <RenderCard category={{
            title: "Transport Vouchers",
            totalVouchers: transportVouchers?.length ?? 0,
            locked: booking.includes?.transport ? false : true,
            statusCount: getStatusesCount(transportVouchers),
          }}
            pathname={pathname}
            booking={{ id: booking.id, status: booking.status ?? 'inprogress' }}
          />

          <RenderCard category={{
            title: "Activity Vouchers",
            totalVouchers: activityVouchers?.length ?? 0,
            locked: booking.includes?.activities ? false : true,
            statusCount: getStatusesCount(activityVouchers),
          }}
            pathname={pathname}
            booking={{ id: booking.id, status: booking.status ?? 'inprogress' }}
          />

          <RenderCard category={{
            title: "Shop Vouchers",
            totalVouchers: shopVouchers?.length ?? 0,
            locked: booking.includes?.shops ? false : true,
            statusCount: getStatusesCount(shopVouchers),
          }}
            pathname={pathname}
            booking={{ id: booking.id, status: booking.status ?? 'inprogress' }}
          />
        </div>
      )}
      {/* {renderCard({
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
      })} */}
      <div className="flex flex-row justify-stretch gap-2">
        <Button
          variant={"primaryGreen"}
          onClick={onTourPacketClick}
          className="w-full"
        >Tour Packet - Check List</Button>
        {/* <Button
          variant={"primaryGreen"}
          onClick={onTourInvoiceClick}
          className="w-full"
        >Proforma Invoice</Button> */}
        <div className="w-full">
          <TourInvoiceModalTrigger bookingData={booking} />
        </div>

        {orgRole === 'org:admin' && (
          <Button
            variant={"destructive"}
            onClick={onCancelBooking}
            className="w-full"
          >Cancel Booking</Button>
        )}

      </div>
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
              <TourPacketCheckList organization={organization} user={user as UserResource} bookingData={booking} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AssignTeamModal
        isOpen={isAssignTeamModalOpen}
        onClose={() => setIsAssignTeamModalOpen(false)}
        marketingTeams={marketingTeams}
        onSelectTeam={() => { console.log("") }}
        booking={booking}
      />

      <Dialog open={showCancelBooking} onOpenChange={setShowCancelBooking} >
        <DialogContent className="max-w-fit max-h-[90%] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Cancel Booking| {booking.id}</DialogTitle>
            <DialogDescription>
              This action will cancel the booking
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="text-[13px]">
              This action will cancel the booking and all the vouchers associated with it. Are you sure you want to cancel the booking?
            </div>
            <div className="mt-4 text-[13px]">
              <label htmlFor="reasonToCancel" className="text-[13px] font-semibold">Reason to cancel</label>
              <input type="text" id="reasonToCancel" value={reasonToCancel} onChange={(e) => setReasonToCancel(e.target.value)} className="w-full h-12 mt-1 p-2 border border-primary-borderGray rounded-md" />
            </div>
            <div className="w-full flex items-center justify-end gap-4 mt-4">
              <Button variant="destructive" onClick={cancelBooking} disabled={isCancelling}>
                {isCancelling ? (
                  <div className="flex flex-row gap-1 items-center">
                    <LoaderCircle size={20} />
                    <div>Cancelling</div>
                  </div>
                ) : 'Cancel Booking'}
              </Button>
              <Button variant="outline" onClick={() => setShowCancelBooking(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SidePanel;
