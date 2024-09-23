import { ColumnDef } from "@tanstack/react-table";
import { HotelStaffType } from "../generalForm/columns";

export const columns: ColumnDef<HotelStaffType>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Contact Number',
    accessorKey: 'contactNumber',
  },
  {
    header: 'Occupation',
    accessorKey: 'occupation',
  },
  {
    header: 'Actions',
    accessorKey: 'id', // Assuming you have an ID to perform actions
    // cell: ({ getValue }) => (
    //   <button onClick={() => console.log(`Edit staff with ID:`)}>
    //     Edit
    //   </button>
    // ),
  },
];
export type { HotelStaffType };

