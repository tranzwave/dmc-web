import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction, useEffect, useState } from "react";
import { Input } from "~/components/ui/input";

const CreateRateColumn = <T extends object>(
    initialRate: string,
    setRate: React.Dispatch<SetStateAction<string>>,
  ): ColumnDef<T> => ({
    accessorKey: "rate",
    header: "Rate - USD",
    cell: ({ getValue, row, column }) => {
      const RateInput = () => {
        const [rate, setLocalRate] = useState<string>(initialRate);
  
        useEffect(() => {
          setLocalRate(initialRate);
        }, [initialRate]);
  
        const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          setLocalRate(inputValue);
          // setRate(inputValue);
          (row.original as Record<string, any>)[column.id] = inputValue;
        };
  
        return (
          <Input
            type="number"
            value={rate}
            onChange={handleRateChange}
            onBlur={()=> setRate(rate)}
            className="rounded border border-gray-300 p-1"
            style={{ width: "80px" }}
            placeholder="0.00"
          />
        );
      };
  
      return <RateInput />;
    },
  });
export default CreateRateColumn;