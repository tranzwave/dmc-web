"use client";

import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { Action } from "@radix-ui/react-alert-dialog";
import { LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { BookingDTO, columns } from "~/components/bookings/home/columns";
import { DataTable } from "~/components/bookings/home/dataTable";
import SidePanel from "~/components/bookings/home/sidePanel";
import LoadingLayout from "~/components/common/dashboardLoading";
import Pagination from "~/components/common/pagination";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { toast } from "~/hooks/use-toast";
import { ClerkUserPublicMetadata } from "~/lib/types/payment";
import { getAllBookingLines } from "~/server/db/queries/booking";
import { createNotification } from "~/server/db/queries/notifications";
import { InsertNotification } from "~/server/db/schemaTypes";
import { useUserPermissions } from "../context";

export default function Bookings() {
  const [data, setData] = useState<BookingDTO[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingDTO | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { organization, isLoaded, membership, memberships } = useOrganization();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { orgRole, isLoaded: isAuthLoaded } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [sending, setIsSending] = useState<boolean>(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const permissions = useUserPermissions();



  const fetchBookingLines = async () => {
    console.log("Fetching Booking Data");
    setLoading(true);
    try {
      if (!organization || !user || !orgRole) {
        return
      }
      const userEnrolledTeams = (user?.publicMetadata as ClerkUserPublicMetadata)?.teams?.map((team) => team.teamId);
      const userManagedTeams = (user?.publicMetadata as ClerkUserPublicMetadata)?.teams?.filter((team) => team.orgId === organization.id && team.role === "manager").map((team) => team.teamId);
      const isSuperAdmin = orgRole === "org:admin";
      console.log("User Enrolled Teams:", userEnrolledTeams);
      console.log("Is Super Admin:", isSuperAdmin);
      const result = await getAllBookingLines(organization.id, userEnrolledTeams, isSuperAdmin);
      if (!result) {
        throw new Error("Couldn't find any bookings");
      }

      console.log("Booking Data:", result);

      // Ensure that 'createdAt' is cast as a Date object properly
      const sortedResult = result.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        return dateB.getTime() - dateA.getTime(); // Compare the timestamps
      });

      const filteredDataBasedOnAccessLevels = sortedResult.filter((booking) => {
        // check if the booking team is a team where user is the manager
        const isUserManagerOfBookingsTeam = userManagedTeams?.includes(booking.booking.marketingTeamId ?? "");
        if (isUserManagerOfBookingsTeam) {
          return true;
        }
        const isUserEitherManagerOrCoordinator = orgRole === "org:admin" || booking.booking.managerId === user.id || booking.booking.coordinatorId === user.id;
        const isUserMembershipEitherManagerOrCoordinator = booking.booking.managerId === membership?.id || booking.booking.coordinatorId === membership?.id;
        return isUserEitherManagerOrCoordinator || isUserMembershipEitherManagerOrCoordinator;
      }
      );

      setData(filteredDataBasedOnAccessLevels);
      // setSelectedBooking(sortedResult[0]);

      //find the first booking that is not cancelled and user either is the manager or coordinator or super admin
      // const firstBooking = sortedResult.find((booking) => {
      //   const isUserEitherManagerOrCoordinator = orgRole === "org:admin" || booking.booking.managerId === user.id || booking.booking.coordinatorId === user.id;
      //   const isUserMembershipEitherManagerOrCoordinator = booking.booking.managerId === membership?.id || booking.booking.coordinatorId === membership?.id;
      //   return booking.status !== "cancelled" && (isUserEitherManagerOrCoordinator || isUserMembershipEitherManagerOrCoordinator);
      // });

      setSelectedBooking(filteredDataBasedOnAccessLevels[0] ?? null);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch booking data:", error);
      setError("Failed to load data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingLines();
  }, [organization, user, orgRole]);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id && id.length > 0) {
      setSearchQuery(id);
    }
  }
    , [searchParams]);

  const handleRowClick = (booking: BookingDTO) => {
    console.log("Selected Booking:", booking);
    setSelectedBooking(booking);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const parseDate = (dateString: string) => new Date(dateString);

  const filteredData = data.filter((booking) => {
    const searchTerm = searchQuery.toLowerCase();
    const bookingStartDate = booking.startDate;
    const bookingEndDate = booking.endDate;

    const matchesSearch =
      booking.id.toString().toLowerCase().includes(searchTerm) ||
      booking.booking.client.name.toLowerCase().includes(searchTerm);

    const matchesStartDate = startDate
      ? bookingStartDate >= parseDate(startDate)
      : true;
    const matchesEndDate = endDate
      ? bookingEndDate <= parseDate(endDate)
      : true;

    return matchesSearch && matchesStartDate && matchesEndDate;
    if (!user || !membership) {
    }
    // const isUserEitherManagerOrCoordinator = orgRole === "org:admin" || booking.booking.managerId === user.id || booking.booking.coordinatorId === user.id;

    // const isUserMembershipEitherManagerOrCoordinator = booking.booking.managerId === membership.id || booking.booking.coordinatorId === membership.id;

    // return matchesSearch && matchesStartDate && matchesEndDate && (isUserEitherManagerOrCoordinator || isUserMembershipEitherManagerOrCoordinator);
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage,
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  if (loading || !isLoaded) {
    return (
      <div>
        <div className="flex w-full flex-row justify-between gap-1">
          <TitleBar title="Bookings" link="toAddBooking" />
          <div>
            <Link href={`${pathname}/add`}>
              <Button variant="primaryGreen">Add Booking</Button>
            </Link>
          </div>
        </div>
        <LoadingLayout />
      </div>
    );
  }

  const sendAddToTeamRequestNotification = async () => {
    try {
      setIsSending(true);
      
      if(!organization || !user){
        toast({
          title: "Organization or User not found",
          description: "Please try again later",
        });
        setIsSending(false);
        return
      }
      console.log(memberships)
      const orgMembers = await organization.getMemberships({role: ["org:admin"]});

      const orgAdmin = orgMembers.data[0];
      if(!orgAdmin || !orgAdmin.publicUserData.userId){
        toast({
          title: "Organization Admin not found",
          description: "Please try again later",
        });
        setIsSending(false);
        return
      }
      const notificationToSend:InsertNotification = {
        title: "Request Access",
        pathname: "/dashboard/admin?tab=marketingTeams",
        tenantId: organization.id,
        targetUser: orgAdmin.publicUserData.userId,
        message: `${user?.firstName} ${user?.lastName} has requested access to a marketing team.`,
      }
      const response = await createNotification(notificationToSend);

      if (!response) {
        throw new Error("Failed to send notification");
      }

      toast({
        title: "Request Sent",
        description: `Your request has been sent to ${orgAdmin.publicUserData.firstName} ${orgAdmin.publicUserData.lastName}`,
      })

      console.log("Notification sent successfully");
      setIsSending(false);

    } catch (error) {
      console.error("Failed to send notification:", error);
      toast({
        title: "Failed to send request",
        description: "Please try again later",
      });
      setIsSending(false);
    }
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Bookings" link="toAddBooking" />
            <div>
              {user && organization && (
                <div>
                  {
                    permissions.includes("booking:create") ?  (
                      <div>
                        {(user?.publicMetadata as ClerkUserPublicMetadata)?.teams?.filter(t => t.orgId === organization.id).map((team) => team.teamId).length > 0 ? (
                          <Link href={`${pathname}/add`}>
                            <Button variant="primaryGreen">Add Booking</Button>
                          </Link>
                        ) : (
                          <div>
                            <Dialog>
                              <DialogTrigger>
                                <Button variant="primaryGreen">Add Booking</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogTitle>
                                  <div className="text-xl font-semibold">Unauthorized</div>
                                </DialogTitle>
                                <DialogDescription>
                                  <div className="text-sm">
                                    You are not a part of any marketing team.
                                  </div>

                                </DialogDescription>
                                <div>
                                  {orgRole === "org:admin" ? (
                                    <div>
                                      <div className="text-sm">
                                        Please add yourself to a team to create a booking.
                                      </div>
                                      <div className="flex flex-row gap-2 w-full justify-end">
                                        <Link href={`/dashboard/admin?tab=marketingTeams`}>
                                          <Button variant="primaryGreen">Self Assign</Button>
                                        </Link>
                                        <DialogClose>
                                          <Button variant="default">Close</Button>
                                        </DialogClose>
                                      </div>
                                    </div>

                                  ) : (
                                    <div className="flex flex-col gap-5">
                                      <div className="text-sm">
                                        Please ask your admin to add you to a team to create a booking.
                                      </div>
                                      <div className="flex flex-row gap-2 w-full justify-end">
                                        <Button
                                          variant="primaryGreen"
                                          onClick={sendAddToTeamRequestNotification}
                                          disabled={sending}>
                                          {sending ? (
                                            <div className="flex flex-row items-center gap-2">
                                              <LoaderCircle size={20} className="animate-spin" />
                                              <span>Sending Request</span>
                                            </div>
                                          ) : "Request Access"}
                                        </Button>
                                        <DialogClose>
                                          <Button variant="default">Close</Button>
                                        </DialogClose>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter>

                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button variant="primaryGreen" onClick={
                        () => toast({
                          title: "Unauthorized",
                          description: "You do not have permission to create a booking.",
                        })
                      }>
                        Add Booking
                      </Button>
                    )
                  }
                </div>

              )}
            </div>
          </div>

          <div className="mb-4 flex flex-row gap-3">
            <div className="w-[65%]">
              <div className="flex gap-5">
                <div className="relative w-[40%]">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-500" />{" "}
                  </div>
                  <Input
                    className="pl-10"
                    placeholder="Search by Booking Id or Client Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-5">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <label htmlFor="start-date" className="mb-1 block">
                      Start Date
                    </label>
                    <input
                      title="startDateFilter"
                      type="date"
                      value={startDate ?? ""}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="rounded-md border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <label htmlFor="start-date" className="mb-1 block">
                      End Date
                    </label>
                    <input
                      title="endDateFilter"
                      type="date"
                      value={endDate ?? ""}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="rounded-md border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>
              </div>
              {user && (
                <div className="mt-2">
                  <DataTable
                    columns={columns}
                    data={paginatedData.map((booking) => ({
                      ...booking,
                      currentUser: user.id,
                    }
                    ))}
                    onRowClick={handleRowClick}
                    selectedRow={selectedBooking ?? undefined}
                  />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>

            <div className="w-[35%]">
              <SidePanel
                booking={selectedBooking ? selectedBooking : null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
