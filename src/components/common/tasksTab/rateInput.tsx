import { Column, Row, RowData, Table } from "@tanstack/react-table";
import React, { useCallback, useState } from "react";
import { Input } from "~/components/ui/input";


declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
    }
}

const RateInput = React.memo(({
    row,
    column,
    table,
    handleRateChange,
}: {
    row: Row<any>;
    column: Column<any>;
    table: Table<any>;
    handleRateChange: (id: string, rate: string) => void;
}) => {
    const originalRate = row.original.rate ?? "0"; // Default to "0" if no rate is provided
    const [rate, setRate] = useState<string>(originalRate); // Track the current rate

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRate = e.target.value;

        // Check if the value is a valid number
        if (!isNaN(Number(newRate))) {
            setRate(newRate); // Update local rate state on change if it's a valid number
            handleRateChange(row.original.id, newRate); // Call handleRateChange only with a valid number
        } else {
            // Optionally handle invalid input
            console.warn('Invalid rate value');
        }
    };

    // Optionally, handle blur to trigger final save
    const handleBlur = useCallback(() => {
        handleRateChange(row.original.id, rate);
        table.options.meta?.updateData(row.index, column.id, rate)
        console.log("Final value saved:", rate); // Log the final saved rate
    }, [rate, row.original.id, handleRateChange,column.id, row.index, table.options.meta]);

    return (
        <Input
            type="number"
            value={rate} // Controlled value based on state
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="rounded border border-gray-300 p-1"
            style={{ width: "80px" }}
            placeholder="0.00"
            onClick={(e) => e.stopPropagation()}
            key={`${row.original.id}`}
            min={0}
        />
    );
});


// Set displayName for the component
RateInput.displayName = "RateInput";

export default RateInput;
