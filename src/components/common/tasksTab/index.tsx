"use client";
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { DataTableWithActions } from "~/components/common/dataTableWithActions/index";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/index";

// Define props type for the TasksTab component
interface TasksTabProps<T, L> {
  bookingLineId: string;
  columns: ColumnDef<T>[]; // Columns for the main vouchers
  voucherColumns: ColumnDef<L>[]; // Columns for the voucher lines
  fetchVouchers: (bookingLineId: string) => Promise<T[]>; // Function to fetch vouchers
  formComponent: React.FC<{ selectedItem: T | undefined; onSave: () => void }>; // Form component for editing/creating vouchers
}

interface WithOptionalVoucherLine<L> {
  voucherLine?: L[];
}

const TasksTab = <T extends object & WithOptionalVoucherLine<L>, L extends object>({
  bookingLineId,
  columns,
  voucherColumns,
  fetchVouchers,
  formComponent: FormComponent,
}: TasksTabProps<T, L>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [vouchers, setVouchers] = useState<T[]>([]);
  const [voucherLines, setVoucherLines] = useState<T[]>([])
  const [selectedVoucher, setSelectedVoucher] = useState<T>();
  const [selectedVoucherLine, setSelectedVoucherLine] = useState<L>();

  const getVoucherData = async () => {
    setLoading(true);

    try {
      const response = await fetchVouchers(bookingLineId);

      if (!response) {
        throw new Error(`Error fetching vouchers for booking line ID: ${bookingLineId}`);
      }
      setVouchers(response);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVoucherData();
  }, []);

  const onVoucherRowClick = (row: T) => {
    setSelectedVoucher(row);
  };

  const onVoucherLineRowClick = (row: L) => {
    setSelectedVoucherLine(row);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex w-full flex-row justify-center gap-2">
        <div className="w-[25%]">
          <div className="card">
            <Calendar />
          </div>
        </div>
        <div className="card w-[70%] space-y-6">
          <div className="card-title">Information</div>
          <DataTableWithActions
            columns={columns}
            data={vouchers}
            onRowClick={onVoucherRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          />
          <div className="flex flex-row items-end justify-between">
            <div>{selectedVoucher ? `Voucher Lines` : ""}</div>
            <div className="flex flex-row gap-2">
              <Button variant={"outline"} className="border-red-600">
                Cancel
              </Button>
              <Button variant={"primaryGreen"}>Add Confirmation</Button>
              <Button variant={"primaryGreen"}>Proceed</Button>
            </div>
          </div>
          <DataTableWithActions
            columns={voucherColumns}
            data={selectedVoucher ? selectedVoucher.voucherLine || [] : []}
            onRowClick={onVoucherLineRowClick}
            onView={() => alert("View action triggered")}
            onEdit={() => alert("Edit action triggered")}
            onDelete={() => alert("Delete action triggered")}
          />
          <div className="w-full flex flex-row items-end justify-end">
            <div className="flex flex-row gap-2">
              <Button variant={"outline"} className="border-primary-green">
                Contact
              </Button>
              <Button variant={"outline"} className="border-primary-green">
                Add New Line
              </Button>
            </div>
          </div>
          <FormComponent
            selectedItem={selectedVoucher}
            onSave={() => console.log("Saved")}
          />
        </div>
      </div>
    </div>
  );
};

export default TasksTab;
