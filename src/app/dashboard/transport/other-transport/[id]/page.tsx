"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import TitleBar from "~/components/common/titleBar";
import ContactBox from "~/components/ui/content-box";
import { toast } from "~/hooks/use-toast";
import { GuideDTO } from "~/lib/types/guide/type";
import { formatDate } from "~/lib/utils/index";
import {
  getGuideByIdQuery,
  getOtherTransportById
} from "~/server/db/queries/transport";
import { SelectCity, SelectOtherTransport, SelectTransportVoucher } from "~/server/db/schemaTypes";

export type OtherTransportDTO = Awaited<ReturnType<typeof getOtherTransportById>>;

const Page = ({ params }: { params: { id: string } }) => {
  const [otherTransport, setOtherTransport] = useState<OtherTransportDTO | null>(null);
  const [data, setData] = useState<SelectTransportVoucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentStartDate, setCurrentStartDate] = useState<string | null>(null);
  const [currentEndDate, setCurrentEndDate] = useState<string | null>(null);
  const [historyStartDate, setHistoryStartDate] = useState<string | null>(null);
  const [historyEndDate, setHistoryEndDate] = useState<string | null>(null);

  const today = new Date();

  const fetchGuideDetails = async () => {
    try {
      setLoading(true);
      const response = await getOtherTransportById(params.id)
      if(!response) {
        throw new Error("No guide found with the given ID.");
      }
      console.log("response", response);
      setOtherTransport(response ?? null);
    } catch (error:any) {
      console.error("Failed to fetch guide details:", error);
      // setError("Failed to load guide details.");
      toast({
        title: "Failed to fetch guide details",
        description: error?.message ?? "Failed to load guide details.",
      })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchGuideDetails();
    // fetchData();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;
  if (!otherTransport) return <div>No guide found with the given ID.</div>;

  const driverVoucherColumns: ColumnDef<SelectTransportVoucher>[] = [
    {
      accessorKey: "startDate",
      header: "Start Date",
      accessorFn: (row) => formatDate(row.startDate.toString()),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      accessorFn: (row) => formatDate(row.endDate.toString()),
    },
    // { header: "Vehicle Type", accessorFn: (row) => row.vehicleType },
    { header: "Remarks", accessorFn: (row) => row.remarks },
    { header: "Rate", accessorFn: (row) => row.rate },
  ];

  const filterData = (
    data: SelectTransportVoucher[],
    startDate: string | null,
    endDate: string | null,
    isCurrent: boolean,
  ) => {
    return data.filter((transport) => {
      const transportStartDate = new Date(transport.startDate);
      const transportEndDate = new Date(transport.endDate);
      const isEndDateValid = isCurrent
        ? transportEndDate >= today
        : transportEndDate < today;

      const matchesStartDate = startDate
        ? transportStartDate >= new Date(startDate)
        : true;
      const matchesEndDate = endDate
        ? transportEndDate <= new Date(endDate)
        : true;

      return isEndDateValid && matchesStartDate && matchesEndDate;
    });
  };

  const filteredCurrentData = filterData(
    data,
    currentStartDate,
    currentEndDate,
    true,
  );
  const filteredTripHistoryData = filterData(
    data,
    historyStartDate,
    historyEndDate,
    false,
  );

  return (
    <div className="flex w-full flex-col justify-between gap-3">
      <TitleBar title={`Guide - ${otherTransport.name}`} link="toAddTransport" />
      <div className="mx-9 flex flex-row justify-between">
        <div className="w-[30%]">
          <ContactBox
            title={otherTransport.name}
            description="Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse."
            location={otherTransport.city.name}
            address={`${otherTransport.streetName}, ${otherTransport.city.name}`}
            phone={otherTransport.primaryContactNumber}
            email={otherTransport.primaryEmail}
          />
        </div>
        {/* <div className="card w-[70%] space-y-6">
          <div>Current Booking</div>
          <div className="flex gap-5">
            <DateInput
              label="Start Date"
              value={currentStartDate}
              onChange={setCurrentStartDate}
            />
            <DateInput
              label="End Date"
              value={currentEndDate}
              onChange={setCurrentEndDate}
            />
          </div>
          <DataTable
            columns={driverVoucherColumns}
            data={filteredCurrentData}
          />

          <div>Booking History</div>
          <div className="col-span-3 flex justify-between gap-6">
            <StatsCard label="Fee Per KM (LKR)" value={driver.feePerKM ?? 0} />
            <StatsCard label="Bookings Completed" value={data.length} />
            <StatsCard label="Upcoming Bookings" value={data.length} />
          </div>

          <div>Trip History</div>
          <div className="flex gap-5">
            <DateInput
              label="Start Date"
              value={historyStartDate}
              onChange={setHistoryStartDate}
            />
            <DateInput
              label="End Date"
              value={historyEndDate}
              onChange={setHistoryEndDate}
            />
          </div>
          <DataTable
            columns={driverVoucherColumns}
            data={filteredTripHistoryData}
          />
        </div> */}
      </div>
    </div>
  );
};

const DateInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
}) => (
  <div className="flex items-center gap-3 text-sm text-gray-500">
    <label className="mb-1 block">{label}</label>
    <input
     title="Start Date"
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
    />
  </div>
);

export default Page;
