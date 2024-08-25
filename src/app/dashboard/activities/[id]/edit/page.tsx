"use client"; 

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GeneralTab from "~/components/activities/editActivity/forms/generalForm";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Activity, getActivityData } from "~/lib/api";
import { EditActivityProvider, useEditActivity } from "./context";

const SubmitForm = () => {
  const { activityDetails } = useEditActivity();

  const handleSubmit = () => {
    console.log("Submitting activity details:", activityDetails);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="card h-10 w-full">
        <p>Review all the details and submit your activity.</p>
      </div>
      <div className="flex w-full justify-center">
        <Button variant="primaryGreen" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

const EditActivity = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const [activity, setActivity] = useState<Activity | null>(null);
  const { setGeneralDetails } = useEditActivity();
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivityDetails() {
      try {
        setLoading(true);
        const activities = await getActivityData();
        const selectedActivity = activities.find(
          (activity) => activity.id.toString() === id,
        );
        setActivity(selectedActivity ?? null);
      } catch (error) {
        console.error("Failed to fetch activity details:", error);
        setError("Failed to load activity details.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivityDetails();
  }, [id]);

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
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title={`Edit Activity ${id}`} link="toAddActivity" />
            <div>
              <Link href={pathname}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className="w-full">
            <Tabs defaultValue="general" className="w-full border">
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="submit">Submit</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <GeneralTab />
              </TabsContent>
              <TabsContent value="submit">
                <SubmitForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedEditActivity() {
  const { id } = useParams();
  return (
    <EditActivityProvider>
      {id ? <EditActivity id={id as string} /> : <div>No activity ID provided.</div>}
    </EditActivityProvider>
  );
}
