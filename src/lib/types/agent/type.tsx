import { ColumnDef } from "@tanstack/react-table";
import DataTableDropDwn from "~/components/common/dataTableDropdown";

// Define the Agent type
type Agent = {
  id: number
  general: {
    name: string;
    country: string;
    agency: string;
    primaryContactNumber: string;
    primaryEmailAddress: string;
    tripsCompleted: string;
  };
};

export type { Agent };


export const agentColumns: ColumnDef<Agent>[] = [
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
      const agent = row.original as Agent;
      return (
          <DataTableDropDwn data={agent} routeBase="/agents/" 
          onViewPath={(data) => `/dashboard/agents/${data.id}`}
          onEditPath={(data) => `/dashboard/agents/${data.id}/edit`}
          onDeletePath={(data) => `/dashboard/agents/${data.id}/delete`}
/>
      );
    },
  },
];
