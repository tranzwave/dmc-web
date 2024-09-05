'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { getAgentData } from "~/lib/api";
import { Agent, agentColumns } from "~/lib/types/agent/type";

const AgentHome = () => {
    const pathname = usePathname();

    const [data, setData] = useState<Agent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


        // Fetch data on mount
        useEffect(() => {
            async function fetchData() {
                try {
                    setLoading(true);
                    const result = await getAgentData();
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
                        <TitleBar title="Agents" link="toAddBooking" />
                        <div>
                        <Link href={`${pathname}/add`}>
                             <Button variant="primaryGreen">Add Agent</Button>
                          </Link>           
                        </div>  
                    </div>
                    <div className='flex flex-row gap-3 justify-center'>
                        <div className='w-[90%]'>
                            <DataTable
                                columns={agentColumns}
                                data={data}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AgentHome;
