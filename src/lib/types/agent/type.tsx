import { ColumnDef } from "@tanstack/react-table";
import DataTableDropDown from "~/components/common/dataTableDropdown";
import { SelectAgent } from "~/server/db/schemaTypes";


// Define the Agent type
type Agent = {
  id: number
  general: {
    name: string;
    country: string;
    agency: string;
    primaryContactNumber: string;
    email: string;
    tripsCompleted: string;
  };
};

export type { Agent };


export const agentColumns: ColumnDef<SelectAgent>[] = [
  {
    accessorKey: "general.name",
    header: "Name",
  },
  {
    accessorKey: "general.country",
    header: "Country",
  },
  {
    accessorKey: "general.agency",
    header: "Agency",
  },
  {
    accessorKey: "general.primaryEmailAddress",
    header: "Contact",
  },
  {
    accessorKey: "general.primaryEmailAddress",
    header: "Email",
  },
  {
    accessorKey: "general.tripsCompleted",
    header: "Trips Completed",
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ getValue, row }) => {
      const agent = row.original;
      return (
          <DataTableDropDown data={agent} routeBase="/agents/" 
          onViewPath={(data) => `/dashboard/agents/${data.id}`}
          onEditPath={(data) => `/dashboard/agents/${data.id}/edit`}
          onDeletePath={(data) => `/dashboard/agents/${data.id}/delete`}
/>
      );
    },
  },
];
