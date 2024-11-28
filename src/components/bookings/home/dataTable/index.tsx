"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  selectedRow?: TData;
  renderExpandedRow?: (row: TData) => JSX.Element;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  selectedRow,
  renderExpandedRow,
}: DataTableProps<TData, TValue>) {
  const [expandedRow, setExpandedRow] = useState<TData | null>(null); // Track the expanded row

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (row: TData) => {
    // If the row is already expanded, collapse it. Otherwise, expand it.
    if(onRowClick ?? renderExpandedRow){
      setExpandedRow((prevExpandedRow) =>
        prevExpandedRow === row ? null : row
      );
      onRowClick?.(row); // Trigger the onRowClick handler if provided
    }

  };

  return (
    <div className="rounded-lg border border-primary-borderGray shadow-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <>
                {/* Main Row */}
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                  className={`cursor-pointer hover:bg-gray-100 ${
                    selectedRow && selectedRow === row.original
                      ? "bg-green-200"
                      : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Expanded Row */}
                {expandedRow === row.original && renderExpandedRow ? (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <div className="p-4">
                        {/* Render the expanded content */}
                        {renderExpandedRow(row.original)}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
