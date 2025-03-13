import { ColumnDef } from "@tanstack/react-table";
import DataTableDropDown from "~/components/common/dataTableDropdown";
import { InsertCity, SelectLanguage } from "~/server/db/schemaTypes";

// Define the Address type
type Address = {
  streetName: string;
  city: string; // Change if city needs to include more detail
  province: string;
};

export enum VehicleType {
  CAR = "CAR",
  BUS = "BUS",
  VAN = "VAN",
  TUK = "TUK",
}

// Define the Vehicle type
type Vehicle = {
  primary: boolean;
  vehicleType: VehicleType;
  numberPlate: string;
  seats: number;
  make: string;
  model: string;
  year: number;
  licenseID: string;
};

// Define the Charges type
type Charges = {
  feePerKm: number;
  fuelAllowance: number;
  accommodationAllowance: number;
  mealAllowance: number;
};

// Define the Documents type
type Documents = {
  driversLicense: string;
  guideLicense: string;
  vehicleEmissionTest: string;
  insurance: string;
};

// Define the Driver type
type Driver = {
  id: number;
  general: {
    name: string;
    languages: string[];
    primaryEmail: string;
    primaryContactNumber: string;
    address: Address;
    guide: boolean;
  };
  vehicles: Vehicle[];
  charges: Charges;
  documents: Documents;
  languages?: SelectLanguage[];
};


export type DriverDTO = {
  id?: string;
  tenantId: string;
  name: string;
  primaryEmail: string;
  primaryContactNumber: string;
  streetName: string;
  province: string;
  type: string;
  feePerKM?: number | null; 
  fuelAllowance?: number; 
  accommodationAllowance?: number; 
  mealAllowance?: number; 
  driversLicense: string;
  driversLicenseURL?: string | null;

  guideLicense?: string | null;
  guideLicenseURL?: string | null;

  insurance: string;
  insuranceURL?: string | null;
  
  contactNumber: string;
  createdAt?: Date | null; 
  updatedAt?: Date | null; 
  city: InsertCity; // Ensure InsertCity is correctly defined
};

// Define Driver columns
export const driverColumns: ColumnDef<DriverDTO>[] = [
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
          onViewPath={(data) => `/dashboard/transport/${data.id}`}
          onEditPath={(data) => `/dashboard/transport/${data.id}/edit`}
          onDeletePath={(data) => `/dashboard/transport/${data.id}/delete`}
        />
      );
    },
  },
];

export type { Driver };

