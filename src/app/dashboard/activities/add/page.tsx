"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import ActivityTab from "~/components/activities/addActivity/forms/activityForm";
import GeneralTab from "~/components/activities/addActivity/forms/generalForm";
import SubmitForm from "~/components/activities/addActivity/forms/submitForm";
import TitleBar from "~/components/common/titleBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AddActivityProvider, useAddActivity } from "./context";

// const SubmitForm = () => {
//   const { activityDetails } = useAddAgent();

//   const handleSubmit = () => {
//     // Handle the submission of activityDetails
//     console.log('Submitting activity details:', activityDetails);
//   };

//   return (
//     <div className='flex flex-col gap-3'>
//       <div className='card w-full h-10'>
//         <p>Review all the details and submit your activity.</p>
//       </div>
//       <div className='flex w-full justify-center'>
//         <Button variant="primaryGreen" onClick={handleSubmit}>
//           Submit
//         </Button>
//       </div>
//     </div>
//   );
// };

const AddActivityVendor = () => {
  const pathname = usePathname();
  const { activityVendorDetails, activeTab, setActiveTab } = useAddActivity();

  useEffect(() => {
    console.log("Add Activity Component");
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Add Activity Vendor" link="toAddActivity" />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
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
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                <GeneralTab />
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

export default function WrappedAddActivity() {
  return (
    <AddActivityProvider>
      <AddActivityVendor />
    </AddActivityProvider>
  );
}
