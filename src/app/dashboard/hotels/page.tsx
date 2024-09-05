'use client';
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { getHotelData } from "~/lib/api";
import { HotelDTO } from "~/lib/types/hotel";
import { getAllHotels } from "~/server/db/queries/hotel";
import { SelectHotel } from "~/server/db/schemaTypes";
import DataTableDropDown from "~/components/common/dataTableDropdown";

const HotelsHome = () => {
    const [data, setData] = useState<HotelDTO[]>([]);
    const [selectedHotel, setSelectedHotel] = useState<HotelDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);  
    const [error, setError] = useState<string | null>(null);

    const pathname = usePathname();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // const result = await getHotelData();
                const result = await getAllHotels();

                setData(result);
            } catch (error) {
                console.error("Failed to fetch hotel data:", error);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleRowClick = (hotel: HotelDTO) => {
        setSelectedHotel(hotel);
    };

    const handleCloseSidePanel = () => {
        setSelectedHotel(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-1 w-full justify-between">
                        <TitleBar title="Hotels" link="toAddHotel" />
                        <Link href={`${pathname}/add`}>
                            <Button variant="primaryGreen">Add Hotel</Button>
                        </Link>  
                    </div>
                    <div className='flex flex-row gap-3 justify-center'>
                        <div className='w-[90%]'>
                            <DataTable columns={columns} data={data} onRowClick={handleRowClick} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelsHome;



export const columns: ColumnDef<HotelDTO>[] = [
    {
      accessorKey: "name",
      header: "Hotel Name",
    },
    {
      accessorKey: "city.name",
      header: "City",
    },
    {
      accessorKey: "stars",
      header: "Stars",
    },
    {
      accessorKey: "primaryContactNumber",
      header: "Contact Number",
    },
    {
      accessorKey: "primaryEmail",
      header: "Email",
    },
    {
        accessorKey: 'id',
        header: '',
        cell: ({ getValue, row }) => {
          const hotel = row.original as HotelDTO;
    
          return (
              <DataTableDropDown data={hotel} routeBase="/hotels" 
              onViewPath={(data) => `/dashboard/hotels/${data.id}`} 
              onEditPath={(data) => `/dashboard/hotels/${data.id}/edit`}
              onDeletePath={(data) => `/dashboard/hotels/${data.id}/delete`}/>
          );
        },
      },
    
  ];
