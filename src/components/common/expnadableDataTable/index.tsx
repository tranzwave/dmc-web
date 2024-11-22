import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";


interface DataTableWithActionsProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    onRowClick: (row: T) => void;
    onEdit: (row: T) => void;
    onDelete: (row: T) => void;
    expandedColumns: ColumnDef<any>[]; // Define the columns for the expanded row
    onView?: () => void;
    onDuplicate?: (row: T) => void;
    selectedRow?: T;
}

export const ExpandableDataTableWithActions = <T extends object>({
    data,
    columns,
    onRowClick,
    onView,
    onEdit,
    onDelete,
    onDuplicate,
    selectedRow,
    expandedColumns,  // Accept the expanded row columns
}: DataTableWithActionsProps<T>) => {

    // Define the action column for the main table
    const actionColumn: ColumnDef<T> = {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {onView && (
                        <div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={onView}>View</DropdownMenuItem>
                        </div>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => onEdit(row.original)}>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => onDelete(row.original)}>Delete</DropdownMenuItem>

                    {onDuplicate && (
                        <div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => onDuplicate(row.original)}>
                                Duplicate
                            </DropdownMenuItem>
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    };

    // Combine main columns with the action column
   

    // Define the expanded row render function inside the component
    const renderExpandedRow = (row: any) => {
        console.log(expandedColumns)
        const combinedColumns = [...expandedColumns, actionColumn];
        return (
            <div>
                {/* Render the expanded table based on expandedColumns */}
                <DataTable
                    columns={combinedColumns as any}  // Main table uses combined columns
                    data={row.voucherLines}
                    selectedRow={selectedRow}
                />
            </div>
        );
    };

    return (
        <DataTable
            columns={columns}  // Main table uses combined columns
            data={data}
            onRowClick={onRowClick}
            selectedRow={selectedRow}
            renderExpandedRow={renderExpandedRow}  // Use the internal renderExpandedRow
        />
    );
};
