"use client"
import { ColumnDef } from "@tanstack/react-table";
import { SelectHotelVoucherLine, SelectRestaurantVoucherLine } from "~/server/db/schemaTypes";
import RateInput from "./rateInput";
import { use, useEffect, useState } from "react";
import { VoucherSettings } from "~/lib/types/booking";

const CreateRateColumn = <T extends object>({
  handleRateChange,
  currency
}: {
  handleRateChange: (id:string, rate:string) => void;
  currency: string;
}) => {
  // Memoize the column definition to avoid unnecessary re-renders
  const columnDef: ColumnDef<SelectHotelVoucherLine | SelectRestaurantVoucherLine> = {
    accessorKey: "rate",
    header: `Rate - ${currency}`,
    cell: ({ row, column, table }) => {
      return (
        <RateInput
          row={row}
          column={column}
          table={table}
          handleRateChange={handleRateChange}
          key={`${row.id}-${column.id}-input`}
        />
      );
    },
  };

  return columnDef;
};

export default CreateRateColumn;
