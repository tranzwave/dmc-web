'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { getActivityData } from "~/lib/api";
import { Activity, activityColumns } from "~/lib/types/activity/type";

const ActivityHome = () => {
    const pathname = usePathname();

    const [data, setData] = useState<Activity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


        // Fetch data on mount
        useEffect(() => {
            async function fetchData() {
                try {
                    setLoading(true);
                    const result = await getActivityData();
                    setData(result);
                } catch (error) {
                    console.error("Failed to fetch activity data:", error);
                    setError("Failed to load data.");
                } finally {
                    setLoading(false);
                }
            }
    
            fetchData();
        }, []);

    
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
                        <TitleBar title="Activity" link="toAddBooking" />
                        <div>
                        <Link href={`${pathname}/add`}>
                             <Button variant="primaryGreen">Add Activity</Button>
                          </Link>           
                        </div>  
                    </div>
                    <div className='flex flex-row gap-3 justify-center'>
                        <div className='w-[90%]'>
                            <DataTable
                                columns={activityColumns}
                                data={data}
                                
                                onRowClick={(activity: Activity) => {
                                    window.location.href = `/dashboard/activities/${activity.id}`;
                                }}
                                // onEdit={(row) => console.log("Edit row", row)} // Handle edit action
                                // onDelete={(row) => console.log("Delete row", row)} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityHome;
