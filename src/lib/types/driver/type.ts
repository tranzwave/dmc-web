import { ColumnDef } from "@tanstack/react-table";

// Define the Address type
type Address = {
  streetName: string;
  city: string;
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
  id: number
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
};

export const driverColumns: ColumnDef<Driver>[] = [
  {
    accessorKey: "general.name",
    header: "Name",
  },
  {
    accessorKey: "general.primaryEmail",
    header: "Primary Email",
  },
  {
    accessorKey: "general.primaryContactNumber",
    header: "Primary Contact Number",
  },
  {
    accessorKey: "general.address.streetName",
    header: "Street Name",
  },
  {
    accessorKey: "general.address.city",
    header: "City",
  },

  {
    accessorKey: "charges.feePerKm",
    header: "Fee per KM",
  },
];

export type { Driver };

