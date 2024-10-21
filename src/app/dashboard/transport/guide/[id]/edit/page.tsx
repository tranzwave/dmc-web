"use client";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import DocumentsTab from "~/components/transports/guide/addTransport/forms/documentsForm";
import GeneralTab from "~/components/transports/guide/addTransport/forms/generalForm";
import EditTransportSubmitForm from "~/components/transports/guide/addTransport/forms/submitForm/editTransportSubmit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getGuideDataById } from "~/server/db/queries/transport";
import {
  SelectCity,
  SelectGuide,
  SelectGuideLanguage,
  SelectLanguage
} from "~/server/db/schemaTypes";
import { AddGuideTransportProvider, useAddGuideTransport } from "../../add/context";

export type GuideData = SelectGuide & {
  city: SelectCity;
  languages: (SelectGuideLanguage & {
    language: SelectLanguage;
  })[];
};

// const SubmitForm = () => {
//   const { transportDetails } = useAddTransport();

//   const handleSubmit = () => {
//     // Handle the submission of activityDetails
//     console.log('Submitting booking details:', transportDetails);
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

const EditTransport = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const {
    setGeneralDetails,
    setDocumetsDetails,
    transportDetails,
    setActiveTab,
    activeTab,
  } = useAddGuideTransport();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [guideData, setGuideData] = useState<GuideData>();

  useEffect(() => {
    async function fetchGuideDetails() {
      try {
        setLoading(true);
        const selectedGuide = await getGuideDataById(id);
        if (!selectedGuide) {
          throw new Error("Couldn't find guide");
        }

        setGuideData(selectedGuide);
        setGeneralDetails({
          name: selectedGuide.name,
          city: selectedGuide.cityId.toString(),
          type: selectedGuide.type,
          includes: {
            documents: true,
          },
          language: selectedGuide.languages[0]?.language.id.toString() ?? "",
          primaryContactNumber: selectedGuide.primaryContactNumber,
          primaryEmail: selectedGuide.primaryEmail,
          province: selectedGuide.province,
          streetName: selectedGuide.streetName,
        });

        setDocumetsDetails({
          guideLicense: selectedGuide.guideLicense ?? "",
        });
      } catch (error) {
        console.error("Failed to fetch guide details:", error);
        setError("Failed to load guide details.");
      } finally {
        setLoading(false);
      }
    }

    fetchGuideDetails();
  }, [id]);

  if (loading) {
    return (
      <div>
        <LoadingLayout />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Add Driver" link="toAddTransport" />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
          </div>
          <div className="w-full">
            <Tabs
              defaultValue="general"
              className="w-full border"
              value={activeTab}
            >
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
                      value="documents"
                      statusLabel="Mandatory"
                      isCompleted={
                        transportDetails.documents.guideLicense.length >
                        1
                      }
                      inProgress={activeTab == "documents"}
                      disabled={
                        transportDetails.general.name.length! > 0 
                      }
                    >
                      Documents
                    </TabsTrigger>
                <TabsTrigger
                  value="submit"
                  isCompleted={transportDetails.general.name.length > 0}
                  inProgress={activeTab == "general"}
                  disabled={
                    !transportDetails.documents.guideLicense 
                  }
                >
                  Submit
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                <GeneralTab />
              </TabsContent>
        
              <TabsContent value="documents">
                <DocumentsTab />
              </TabsContent>
          
              <TabsContent value="submit">
                <EditTransportSubmitForm
                  id={id}
                  originalGuideData={guideData ?? null}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedEditTransport() {
  const { id } = useParams();
  return (
    <AddGuideTransportProvider>
      {id ? (
        <EditTransport id={id as string} />
      ) : (
        <div>No transport ID provided.</div>
      )}
    </AddGuideTransportProvider>
  );
}
