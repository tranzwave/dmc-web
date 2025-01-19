"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SelectCity, SelectOtherTransport } from "~/server/db/schemaTypes";
import DataTableDropDown from "~/components/common/dataTableDropdown";



export type AddOtherTransportGeneralType = {
  name: string;
  primaryEmail: string;
  primaryContactNumber: string;
  streetName: string;
  city: string;
  province: string;
  transportMethod: 'Land' | 'Sea' | 'Air';
  vehicleType: string;
  startLocation: string;
  destination: string;
  capacity: number;
  price: number;
  notes: string;
};

export type OtherTransportWithCity = SelectOtherTransport & { city: SelectCity };

export const otherTransportColumns:ColumnDef<OtherTransportWithCity>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "transportMethod",
    header: "Transport Method",
  },
  {
    accessorKey: "city",
    header: "City",
    accessorFn: (data) => data.city.name,
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type",
  },
  {
    accessorKey: "primaryContactNumber",
    header: "Primary Contact Number",
  },
  {
    accessorKey: "startLocation",
    header: "Start Location",
  },
  {
    accessorKey: "destination",
    header: "Destination",
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ getValue, row }) => {
      const transport = row.original;
      return (
        <DataTableDropDown
          data={transport}
          routeBase="/transport"
          onViewPath={(data) => `/dashboard/transport/other-transport/${data.id}`}
          onEditPath={(data) => `/dashboard/transport/other-transport/${data.id}/edit`}
          onDeletePath={(data) => `/dashboard/transport/other-transport/${data.id}/delete`}
        />
      );
    },
  },
];
