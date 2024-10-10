import { ColumnDef } from "@tanstack/react-table";
import DataTableDropDown from "~/components/common/dataTableDropdown";
import { InsertCity, SelectLanguage } from "~/server/db/schemaTypes";

// Define the Address type
type Address = {
  streetName: string;
  city: string; // Change if city needs to include more detail
  province: string;
};

// Define the Documents type
type Documents = {
  driversLicense: string;
};

// Define the Guide type
type Guide = {
  id: number;
  general: {
    name: string;
    languages: string[];
    primaryEmail: string;
    primaryContactNumber: string;
    address: Address;
    guide: boolean;
  };
  documents: Documents;
  languages?: SelectLanguage[];
};


export type GuideDTO = {
  id?: string;
  tenantId: string;
  name: string;
  primaryEmail: string;
  primaryContactNumber: string;
  streetName: string;
  province: string;
  type: string;
  guideLicense?: string | null;
  createdAt?: Date | null; 
  updatedAt?: Date | null; 
  city: InsertCity; // Ensure InsertCity is correctly defined
};

// Define Guide columns
export const guideColumns: ColumnDef<GuideDTO>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "primaryEmail",
    header: "Primary Email",
  },
  {
    accessorKey: "primaryContactNumber",
    header: "Primary Contact Number",
  },
  {
    accessorKey: "streetName",
    header: "Street Name",
  },
  {
    accessorKey: "city.name",
    header: "City",
  },
  {
    accessorKey: "province",
    header: "Province",
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
          onViewPath={(data) => `/dashboard/transport/guide/${data.id}`}
          onEditPath={(data) => `/dashboard/transport/guide/${data.id}/edit`}
          onDeletePath={(data) => `/dashboard/transport/guide/${data.id}/delete`}
        />
      );
    },
  },
];

export type { Guide };

