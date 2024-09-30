// import { DataTable } from "~/components/bookings/home/dataTable";
// import { columns } from "./columns";

// const HotelsBookingTable = () => {
//   return (
//     <div>
//       <DataTable columns={columns} data={[]} />
//     </div>
//   );
// };

// export default HotelsBookingTable;

import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable"; // Assuming this is the path for DataTable component
import { getHotelBookingStats } from "~/server/db/queries/booking";
import { columns } from "./columns"; // Your columns definition

// Type for HotelBooking data
export type HotelsBooking = {
  hotelName: string;
  bookingCount: number;
  lastBookingDate: string | null;
};

const HotelsBookingTable = () => {
  const [data, setData] = useState<HotelsBooking[]>([]); // Initialize state with HotelsBooking[]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: HotelsBooking[] = await getHotelBookingStats(); // Fetch the data (ensure it returns HotelsBooking[])
        setData(result); // Set the fetched data
      } catch (error) {
        console.error("Failed to fetch hotel booking stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <DataTable columns={columns} data={data} /> // Ensure `data` matches the expected type
        
      )}
    </div>
  );
};

export default HotelsBookingTable;
