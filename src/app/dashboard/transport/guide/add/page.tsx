"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import TitleBar from "~/components/common/titleBar";
import DocumentsTab from "~/components/transports/guide/addTransport/forms/documentsForm";
import GeneralTab from "~/components/transports/guide/addTransport/forms/generalForm";
import SubmitForm from "~/components/transports/guide/addTransport/forms/submitForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AddGuideTransportProvider, useAddGuideTransport } from "./context";

const AddGuideTransport = () => {
  const pathname = usePathname();
  const { setGeneralDetails, activeTab, setActiveTab, transportDetails } =
    useAddGuideTransport();

  useEffect(() => {
    console.log("Add Transport Component");
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Add Guide" link="toAddTransport" />
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
                  inProgress={activeTab === "general"}
                >
                  General
                </TabsTrigger>
                    <TabsTrigger
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
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <GeneralTab />
              </TabsContent>
                  <TabsContent value="documents">
                    <DocumentsTab />
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


export default function WrappedAddGuideTransport() {
  return (
    <AddGuideTransportProvider>
      <AddGuideTransport />
    </AddGuideTransportProvider>
  );
}
