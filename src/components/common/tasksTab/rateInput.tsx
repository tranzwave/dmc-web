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

        // Allow empty string, numbers, and decimal points
        if (newRate === "" || /^\d*\.?\d*$/.test(newRate)) {
            setRate(newRate); // Update local rate state on change
        } else {
            // Optionally handle invalid input
            console.warn('Invalid rate value');
        }
    };

    const handleBlur = useCallback(() => {
        // Convert to a proper number format and remove leading zeros
        let processedRate = rate;
        
        if (rate && rate !== "") {
            // Remove leading zeros but keep decimal numbers intact
            // Convert to number and back to string to normalize the format
            const numValue = parseFloat(rate);
            if (!isNaN(numValue)) {
                processedRate = numValue.toString();
            } else {
                processedRate = "0";
            }
        }
        
        // Update the local state with the processed rate
        setRate(processedRate);
        
        // Call the handler with the processed rate
        handleRateChange(row.original.id, processedRate);
    }, [rate, row.original.id, handleRateChange]);

    return (
        <Input
            type="text"
            value={rate} // Controlled value based on state
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="rounded border border-gray-300 p-1"
            style={{ width: "80px" }}
            placeholder="0.00"
            // onClick={(e) => e.stopPropagation()}
            key={`${row.original.id}`}
        />
    );
});


// Set displayName for the component
RateInput.displayName = "RateInput";

export default RateInput;
