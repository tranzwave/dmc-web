import { ColumnDef } from "@tanstack/react-table";
import { HotelRoomType } from "../generalForm/columns";

export const columns: ColumnDef<HotelRoomType>[] = [
  {
    accessorKey: "roomType",
    header: "Room Type",
    cell: ({ row }) => <span>{row.original.roomType}</span>,
  },
  {
    accessorKey: "typeName",
    header: "Type Name",
    cell: ({ row }) => <span>{row.original.typeName}</span>,
  },
  {
    accessorKey: "count",
    header: "Count",
    cell: ({ row }) => <span>{row.original.count}</span>,
  },
  {
    accessorKey: "amenities",
    header: "Amenities",
    cell: ({ row }) => <span>{row.original.amenities}</span>,
  },
  {
    accessorKey: "floor",
    header: "Floor",
    cell: ({ row }) => <span>{row.original.floor}</span>,
  },
  {
    accessorKey: "bedCount",
    header: "Bed Count",
    cell: ({ row }) => <span>{row.original.bedCount}</span>,
  },
  {
    accessorKey: "additionalComments",
    header: "Comments",
    cell: ({ row }) => <span>{row.original.additionalComments ?? "N/A"}</span>,
  },
];
