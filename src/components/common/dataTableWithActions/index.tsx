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

interface DataTableWithActionsProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick: (row: T) => void;
  onEdit: (row:T) => void;
  onDelete: (row:T) => void;
  onView?: () => void;
  onDuplicate?: (row:T) => void;
  selectedRow?: T;
  renderExpandedRow?: (row: T) => JSX.Element;
}

export const DataTableWithActions = <T extends object>({
  data,
  columns,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  selectedRow,
  renderExpandedRow
}: DataTableWithActionsProps<T>) => (
  <DataTable
    columns={[
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
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
          );
        },
      },
    ]}
    data={data}
    onRowClick={onRowClick}
    selectedRow={selectedRow}
    renderExpandedRow={renderExpandedRow}
  />
);

