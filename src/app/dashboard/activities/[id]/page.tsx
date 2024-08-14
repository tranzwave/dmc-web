'use client';
import { useEffect, useState } from 'react';
import { DataTable } from '~/components/bookings/home/dataTable';
import TitleBar from '~/components/common/titleBar';
import { StatsCard } from '~/components/ui/stats-card';
import { Activity, getActivityData } from '~/lib/api';
import { activityColumns } from '~/lib/types/activity/type';

const Page = ({ params }: { params: { id: string }}) => {
    const [activity, setActivity] = useState<Activity | null>(null);
    const [data, setData] = useState<Activity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchActivityDetails() {
            try {
                setLoading(true);
                const activities = await getActivityData();
                const selectedActivity = activities.find(activity => activity.id.toString() === params.id);
                setActivity(selectedActivity || null);
            } catch (error) {
                console.error("Failed to fetch activity details:", error);
                setError("Failed to load activity details.");
            } finally {
                setLoading(false);
            }
        }

        fetchActivityDetails();
    }, [params.id]);

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

    if (!activity) {
        return <div>No activity found with the given ID.</div>;
    }

    return (
        <div>
            <TitleBar title="Activity" link="toAddActivity" />
            <div className="mx-9 flex flex-row justify-between">
                <div className="w-[35%]">
                    <div className="card w-full">Profile</div>
                    <h2>Activity ID from URL: {params.id}</h2>
                    <p>ID: {activity.id}</p>
                    <p>Capacity: {activity.general.capacity}</p>
                </div>
                <div className="card w-[60%] space-y-6">
                    <div>Current Booking</div>
                    <DataTable columns={activityColumns} data={data} />

                    <div>Booking History</div>
                    <div className="col-span-3 flex justify-between gap-6">
                        <StatsCard label="5 Star ratings" value="10" />
                        <StatsCard label="Bookings Completed" value="20" />
                        <StatsCard label="Upcoming Bookings" value="5" />
                    </div>

                    <div>Trip History</div>
                    <DataTable columns={activityColumns} data={data} />
                </div>
            </div>
        </div>
    );
};

export default Page;
