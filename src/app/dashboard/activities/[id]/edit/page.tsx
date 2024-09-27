"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ActivityTab from "~/components/activities/addActivity/forms/activityForm";
import GeneralTab from "~/components/activities/addActivity/forms/generalForm";
import SubmitForm from "~/components/activities/addActivity/forms/submitForm";
import TitleBar from "~/components/common/titleBar";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getActivityVendorDataById } from "~/server/db/queries/activities";
import { AddActivityProvider, useAddActivity } from "../../add/context";
import { FetchedActivityVendorData } from "../page";


const EditActivityVendor = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { activityVendorDetails, activeTab, setActiveTab, setGeneralDetails, addActivity } = useAddActivity();
  const [activityVendor, setActivityVendor] = useState<FetchedActivityVendorData>();
  const [isGeneralDetailsSet, setIsGeneralDetailsSet] = useState<boolean>(false); // State to control rendering

  const fetchActivityVendor = async () => {
    try {
      setLoading(true);
      const selectedActivityVendor = await getActivityVendorDataById(id);
      if (!selectedActivityVendor) {
        throw new Error("Couldn't find activity vendor");
      }

      const { city, activityVoucher, activity, ...general } = selectedActivityVendor;
      setActivityVendor(selectedActivityVendor);

      setGeneralDetails({
        cityId: general.cityId,
        contactNumber: general.contactNumber,
        name: general.name,
        province: general.province,
        streetName: general.streetName,
        tenantId: general.tenantId,
        city: city,
        primaryEmail: general.primaryEmail
      });

      activity.forEach((a) => {
        addActivity({
          tenantId:a.tenantId,
          activityType:a.activityType.id,
          activityVendorId:a.activityVendorId,
          name:a.name,
          capacity:a.capacity,
          id:a.id,
          typeName:a.activityType.name
        });
      });

      setIsGeneralDetailsSet(true); // Mark as ready to render GeneralTab

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch driver details:", error);
      setError("Failed to load driver details.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Add Activity Component");
    fetchActivityVendor();
  }, [id]);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title={`Edit Activity Vendor - ${activityVendor?.name ?? ""}`} link="toAddActivity" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
          </div>
          <div className="w-full">
            <Tabs defaultValue="general" className="w-full border" value={activeTab}>
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger
                  value="general"
                  isCompleted={false}
                  onClick={() => setActiveTab("general")}
                  inProgress={activeTab == "general"}
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  statusLabel="Mandatory"
                  isCompleted={activityVendorDetails.activities.length > 0}
                  inProgress={activeTab == "activities"}
                  disabled={!activityVendorDetails.general.streetName}
                >
                  Activities
                </TabsTrigger>
                <TabsTrigger
                  value="submit"
                  isCompleted={false}
                  disabled={activityVendorDetails.activities.length == 0}
                >
                  Submit
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {/* Conditionally render GeneralTab based on isGeneralDetailsSet */}
                {isGeneralDetailsSet ? <GeneralTab /> : <div>Loading General Details...</div>}
              </TabsContent>
              <TabsContent value="activities">
                <ActivityTab />
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
    <AddActivityProvider>
      {id ? <EditActivityVendor id={id as string} /> : <div>No activity ID provided.</div>}
    </AddActivityProvider>
  );
}
