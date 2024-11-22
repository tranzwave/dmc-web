import { ColumnDef } from "@tanstack/react-table";
import { SelectHotelVoucherLine, SelectRestaurantVoucherLine } from "~/server/db/schemaTypes";
import RateInput from "./rateInput";

const CreateRateColumn = <T extends object>({
  handleRateChange,
}: {
  handleRateChange: (id:string, rate:string) => void;
}) => {
  // Memoize the column definition to avoid unnecessary re-renders
  const columnDef: ColumnDef<SelectHotelVoucherLine | SelectRestaurantVoucherLine> = {
    accessorKey: "rate",
    header: "Rate - USD",
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
