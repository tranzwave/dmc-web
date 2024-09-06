'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Driver, driverColumns, DriverDTO } from "~/lib/types/driver/type";
import { getAllDrivers } from "~/server/db/queries/transport";

const TransportHome = () => {
    const pathname = usePathname();

    const [data, setData] = useState<DriverDTO[]>([]);
    // const [selectedTransport, setSelectedTransport] = useState<Driver | null>(null);
    const [loading, setLoading] = useState<boolean>(true);  // Added loading state
    const [error, setError] = useState<string | null>(null); // Added error state


    // Fetch data on mount
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true); // Set loading to true before starting fetch
                const result = await getAllDrivers(); // Fetch transport data
                setData(result);
            } catch (error) {
                console.error("Failed to fetch transport data:", error);
                setError("Failed to load data."); // Set error message
            } finally {
                setLoading(false); // Set loading to false after fetch is complete
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
          <div>
            <div className="flex w-full flex-row justify-between gap-1">
              <TitleBar title="Transport" link="toAddTransport" />
              <div>
                <Link href={`${pathname}/add`}>
                  <Button variant="primaryGreen">Add Driver</Button>
                </Link>
              </div>
            </div>
              <LoadingLayout />
          </div>
        );
      }

    if (error) {
        return <div>Error: {error}</div>;  // Render error message if there's an error
    }

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-1 w-full justify-between">
                        <TitleBar title="Transport" link="toAddTransport" />
                        <div>
                            <Link href={`${pathname}/add`}>
                                <Button variant="primaryGreen">Add Transport</Button>
                            </Link>             
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 justify-center'>
                        <div className='w-[90%]'>
                            <DataTable columns={driverColumns} data={data}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransportHome;
