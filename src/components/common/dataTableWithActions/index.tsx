import React from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface DataTableWithActionsProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick: (row: T) => void;
  onEdit: (row:T) => void;
  onDelete: () => void;
  onView?: () => void;
  onDuplicate?: () => void;
}

export const DataTableWithActions = <T extends object>({
  data,
  columns,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
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
              {onView ? (
                  <>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem onSelect={onView}>View</DropdownMenuItem>
                  </>
                ) : (
                  ""
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={()=>{onEdit}}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>

                {onDuplicate ? (
                  <>
                  <DropdownMenuSeparator/>
                    <DropdownMenuItem onSelect={onDuplicate}>
                      Duplicate
                    </DropdownMenuItem>
                  </>
                ) : (
                  ""
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ]}
    data={data}
    onRowClick={onRowClick}
  />
);
