'use client';
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import LoadingLayout from "~/components/common/dashboardLoading";
import DataTableDropDown from "~/components/common/dataTableDropdown";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { getAllRestaurantVendors } from "~/server/db/queries/restaurants";
import { SelectCity, SelectRestaurant } from "~/server/db/schemaTypes";

export type RestaurantData = SelectRestaurant & {
    city: SelectCity
}

const RestaurantHome = () => {
    const pathname = usePathname();

    const [data, setData] = useState<RestaurantData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


        // Fetch data on mount
        useEffect(() => {
            async function fetchData() {
                try {
                    setLoading(true);
                    const result = await getAllRestaurantVendors();
                    setData(result);
                } catch (error) {
                    console.error("Failed to fetch restaurant data:", error);
                    setError("Failed to load data.");
                } finally {
                    setLoading(false);
                }
            }
    
            fetchData();
        }, []);

    
        if (loading) {
            return (
                <div>
                  <div className="flex w-full flex-row justify-between gap-1">
                    <TitleBar title="Activity Vendors" link="toAddHotel" />
                    <div>
                      <Link href={`${pathname}/add`}>
                        <Button variant="primaryGreen">Add Activity</Button>
                      </Link>
                    </div>
                  </div>
                    <LoadingLayout />
                </div>
              );        }
    
        if (error) {
            return <div>Error: {error}</div>;
        }

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="flex flex-col gap-3">
                <div className="flex w-full flex-row justify-between gap-1">
                        <TitleBar title="Restaurants" link="toAddRestaurant" />
                        <div>
                        <Link href={`${pathname}/add`}>
                             <Button variant="primaryGreen">Add Restaurant</Button>
                          </Link>           
                        </div>  
                    </div>
                    
                    <div className='flex flex-row gap-3 justify-center'>
                        <div className='w-[90%]'>
                            <DataTable
                                columns={restaurantColumns}
                                data={data}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RestaurantHome;



const restaurantColumns: ColumnDef<RestaurantData>[] = [
    {
      header: "Restaurant",
      accessorFn: row => row.name
    },
    {
      header: "Contact Number",
      accessorFn: row => row.contactNumber
    },
    {
        header: "Street Name",
        accessorFn: row => row.streetName
    },
    {
        header: "City",
        accessorFn: row => row.city.name
    },
    {
        header: "Province",
        accessorFn: row => row.province
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ getValue, row }) => {
        const restaurant = row.original as RestaurantData;
  
        return (
            <DataTableDropDown data={restaurant} routeBase="/restaurants/" 
            onViewPath={(data) => `/dashboard/restaurants/${data.id}`}
            onEditPath={(data) => `/dashboard/restaurants/${data.id}/edit`}
            onDeletePath={(data) => `/dashboard/restaurants/${data.id}`}
            // onDeleted={() => window.location.reload()}  // Refresh page after delete

  />
        );
      },
    },
  ];
