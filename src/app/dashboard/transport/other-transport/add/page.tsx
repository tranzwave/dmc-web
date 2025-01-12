"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import TitleBar from "~/components/common/titleBar";
import AddOtherTransportGeneralForm from "~/components/transports/addTransport/forms/generalForm/other-transport/generalForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const AddOtherTransport = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.log("Add Transport Component");
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Add Other Transport" link="toAddTransport" />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
          </div>
          <div className="w-full">
            <Tabs defaultValue="general" className="w-full border">
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger
                  value="general"
                  isCompleted={false}
                >
                  General
                </TabsTrigger>
                    {/* <TabsTrigger
                      value="documents"
                      statusLabel="Mandatory"
                      isCompleted={transportDetails.general.name.length > 1}
                      inProgress={activeTab === "documents"}
                      disabled={!transportDetails.general.name}
                    >
                      Documents
                    </TabsTrigger>
                <TabsTrigger
                  value="submit"
                  isCompleted={transportDetails.documents.guideLicense.length>0}
                  inProgress={activeTab === "submit"}
                  disabled={
                    !transportDetails.documents.guideLicense
                  }
                >
                  Submit
                </TabsTrigger> */}
              </TabsList>
              <TabsContent value="general">
                <AddOtherTransportGeneralForm />
              </TabsContent>
                  {/* <TabsContent value="documents">
                    <DocumentsTab />
                  </TabsContent>
              <TabsContent value="submit">
                <SubmitForm />
              </TabsContent> */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AddOtherTransport
