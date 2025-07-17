"use client";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingLayout from "~/components/common/dashboardLoading";
import TitleBar from "~/components/common/titleBar";
import DocumentsTab from "~/components/transports/guide/addTransport/forms/documentsForm";
import GeneralTab from "~/components/transports/guide/addTransport/forms/generalForm";
import EditTransportSubmitForm from "~/components/transports/guide/addTransport/forms/submitForm/editTransportSubmit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getGuideDataById, getOtherTransportById } from "~/server/db/queries/transport";
import {
  SelectCity,
  SelectGuide,
  SelectGuideLanguage,
  SelectLanguage
} from "~/server/db/schemaTypes";
import { AddGuideTransportProvider, useAddGuideTransport } from "../../add/context";
import { OtherTransportDTO } from "../page";
import { EditOtherTransportProvider, useEditOtherTransport } from "./context";
import AddOtherTransportGeneralTab from "~/components/transports/addTransport/forms/generalForm/other-transport";
import AddOtherTransportGeneralForm from "~/components/transports/addTransport/forms/generalForm/other-transport/generalForm";
import CityAdder from "~/components/common/cityAdder";
import { is } from "drizzle-orm";

const EditOtherTransport = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const {
    setGeneralDetails,
    otherTransportDetails
  } = useEditOtherTransport();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [otherTransportData, setOtherTransportData] = useState<OtherTransportDTO>();

  useEffect(() => {
    async function fetchOtherTransportDetails() {
      try {
        setLoading(true);
        const response = await getOtherTransportById(id);
        if (!response) {
          throw new Error("Couldn't find guide");
        }

        setOtherTransportData(response);
        setGeneralDetails(response);

      } catch (error) {
        console.error("Failed to fetch guide details:", error);
        setError("Failed to load guide details.");
      } finally {
        setLoading(false);
      }
    }

    fetchOtherTransportDetails();
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
            <TitleBar title="Edit Other Transport" link="toAddTransport" />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
          </div>
          <div className="w-full flex justify-center">
            <div className="flex flex-col w-[90%] mt-2 border rounded-md p-3">
              <div className="w-full">
                <AddOtherTransportGeneralForm 
                defaultValues={
                  {
                    name: otherTransportData?.name ?? "",
                    primaryEmail: otherTransportData?.primaryEmail ?? "",
                    primaryContactNumber: otherTransportData?.primaryContactNumber ?? "",
                    streetName: otherTransportData?.streetName ?? "",
                    cityId: otherTransportData?.cityId.toString() ?? "",
                    province: otherTransportData?.province ?? "",
                    transportMethod: otherTransportData?.transportMethod as "Sea" | "Land" | "Air" ?? "Land",
                    vehicleType: otherTransportData?.vehicleType ?? "",
                    startLocation: otherTransportData?.startLocation ?? "",
                    destination: otherTransportData?.destination ?? "",
                    capacity: otherTransportData?.capacity ?? 1,
                    price: Number(otherTransportData?.price) ?? 0,
                    notes: otherTransportData?.notes ?? "",
                  }
                }
                isEdit={true}
                idToEdit={id}
                />

              </div>
              <CityAdder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedEditOtherTransport() {
  const { id } = useParams();
  return (
    <EditOtherTransportProvider>
      {id ? (
        <EditOtherTransport id={id as string} />
      ) : (
        <div>No transport ID provided.</div>
      )}
    </EditOtherTransportProvider>
  );
}
