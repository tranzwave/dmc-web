"use client";
import { useOrganization } from "@clerk/nextjs";
import { set } from "date-fns";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAddTransport } from "~/app/dashboard/transport/add/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { getAllLanguages, insertDriver } from "~/server/db/queries/transport";
import { language } from "~/server/db/schema";
import {
  InsertDriver,
  InsertLanguage,
  InsertVehicle,
  SelectLanguage,
} from "~/server/db/schemaTypes";

const SubmitForm = () => {
  const { transportDetails } = useAddTransport();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { general, vehicles, charges, documents } = transportDetails;
  const router = useRouter();
  const {organization, isLoaded} = useOrganization();
  const [languages, setLanguages] = useState<SelectLanguage[]>([]);
  const [isFetchingLanguages, setIsFetchingLanguages] = useState(false);

  const addDriver = async () => {
    console.log({
      general,
      vehicles,
      charges,
      documents,
    });

    try {

      if(!organization) {
        throw new Error("Organization not found");
      };

      const driverData: InsertDriver[] = [
        {
          name: general?.name ?? "Unknown", // Provide fallback if general.name is undefined
          primaryEmail: general?.primaryEmail ?? "No email provided",
          primaryContactNumber: general?.primaryContactNumber ?? "No contact",
          streetName: general?.streetName ?? "",
          province: general?.province ?? "",
          contactNumber: general?.primaryContactNumber ?? "",
          tenantId: organization.id,
          cityId: Number(general?.city ?? 0), // Ensure city is a valid number or 0
          driversLicense: documents?.driverLicense ?? "",
          insurance: documents?.insurance ?? "",
          type: general?.type ?? "Unknown",
          guideLicense: documents?.guideLicense ?? "",
          accommodationAllowance: charges?.accommodationAllowance ?? 0,
          fuelAllowance: charges?.fuelAllowance ?? 0,
          mealAllowance: charges?.mealAllowance ?? 0,
          feePerKM: charges?.feePerKm ?? 0,
          feePerDay: charges?.feePerDay ?? 0,
        },
      ];
      
      
          const vehicleData: InsertVehicle[] = vehicles.map((v) => {
            return {
              make: v.make,
              model: v.model,
              numberPlate: v.numberPlate,
              seats: v.seats,
              vehicleType: v.vehicle,
              tenantId: organization.id,
              year: Number(v.year),
              revenueLicense: v.vrl,
            };
          });
      
          const driversLanguages: SelectLanguage[] = general.languages.map((l) => {
            const language = languages.find((lang) => lang.name === l);
            if (!language) {
              throw new Error("Language not found");
            }
            return language;
          }
          );

      setLoading(true);


      // Replace insertDriver with your function to handle the insertion of driver details
      const response = await insertDriver(
        driverData,
        vehicleData,
        driversLanguages,
        organization.id,
        // charges,
        // documents,
      );

      // if (!response) {
      //   throw new Error(`Error: ${response}`);
      // }

      console.log("Success:", response);

      setLoading(false);
      // Handle successful response (e.g., show a success message)
      toast({
        title: "Success",
        description: "Driver added successfully",
      });
      router.push("/dashboard/transport");
    } catch (thrownError:any) {
      if (thrownError instanceof Error) {
        setError(thrownError.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error(thrownError)
      console.error("Error:", error);
      // alert(error);
      setLoading(false);
      toast({
        title: "Uh Oh!",
        description: `Error while adding the driver: ${error ?? "Unknown error"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchLanguages() {
      try {
        setIsFetchingLanguages(true);
        const response = await getAllLanguages();
        
        if (!response) {
          throw new Error("No languages found");
        }


        setLanguages(response);
        setIsFetchingLanguages(false);
      } catch (error) {
        console.error("Error fetching languages:", error);
        setIsFetchingLanguages(false);
      }
    }

    fetchLanguages();
  }
  , []);

  if (isFetchingLanguages) {
    return <LoadingLayout />;
  }

  return (
    <div>
      {/* General Section */}
      <div className="flex w-24 items-center justify-center rounded-t-xl bg-primary-green p-1 text-sm font-bold text-white">
        <div>General</div>
      </div>
      <div className="mb-2 rounded-lg border shadow-md">
        <table className="min-w-full text-xs">
          <tbody>
            <tr>
              <td className="w-1/2 border px-4 py-2 font-bold">Name:</td>
              <td className="w-1/2 border px-4 py-2">{general.name}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Language:</td>
              <td className="border px-4 py-2">{general.languages.join(", ")}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Email:</td>
              <td className="border px-4 py-2">{general.primaryEmail}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Contact Number:</td>
              <td className="border px-4 py-2">
                {general.primaryContactNumber}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Street Name:</td>
              <td className="border px-4 py-2">{general.streetName}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">City:</td>
              <td className="border px-4 py-2">{general.city}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Province:</td>
              <td className="border px-4 py-2">{general.province}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {general.type !== "Guide" && (
        <>
          {/* Vehicles Section */}
          <div className="flex w-24 items-center justify-center rounded-t-xl bg-primary-green p-1 text-sm font-bold text-white">
            <div>Vehicles</div>
          </div>
          <div className="mb-2 rounded-lg border shadow-md">
            <table className="min-w-full text-xs">
              <tbody>
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th
                          className="bg-secondary-green px-4 py-2 text-sm font-bold text-primary-green"
                          colSpan={2}
                        >
                          Vehicle {index + 1}
                        </th>
                      </tr>
                      <tr className="grid-cols-2">
                        <td className="w-1/2 border px-4 py-2 font-bold">
                          Vehicle:
                        </td>
                        <td className="w-1/2 border px-4 py-2">
                          {vehicle.vehicle}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">
                          Number Plate:
                        </td>
                        <td className="border px-4 py-2">
                          {vehicle.numberPlate}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">Seats:</td>
                        <td className="border px-4 py-2">{vehicle.seats}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">Make:</td>
                        <td className="border px-4 py-2">{vehicle.make}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">Model:</td>
                        <td className="border px-4 py-2">{vehicle.model}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">Year:</td>
                        <td className="border px-4 py-2">{vehicle.year}</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-bold">VRL:</td>
                        <td className="border px-4 py-2">{vehicle.vrl}</td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td className="border px-4 py-2" colSpan={2}>
                      No vehicles added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Charges Section */}
          <div className="flex w-24 items-center justify-center rounded-t-xl bg-primary-green p-1 text-sm font-bold text-white">
            <div>Charges</div>
          </div>
          <div className="mb-2 rounded-lg border shadow-md">
            <table className="min-w-full text-xs">
              <tbody>
                <tr>
                  <td className="w-1/2 border px-4 py-2 font-bold">
                    Fee Per Km:
                  </td>
                  <td className="w-1/2 border px-4 py-2">{charges.feePerKm}</td>
                </tr>
                <tr>
                  <td className="w-1/2 border px-4 py-2 font-bold">
                    Fee Per Day:
                  </td>
                  <td className="w-1/2 border px-4 py-2">
                    {charges.feePerDay}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">
                    Fuel Allowance:
                  </td>
                  <td className="border px-4 py-2">{charges.fuelAllowance}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">
                    Accommodation Allowance:
                  </td>
                  <td className="border px-4 py-2">
                    {charges.accommodationAllowance}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">
                    Meal Allowance:
                  </td>
                  <td className="border px-4 py-2">{charges.mealAllowance}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Documents Section */}
          <div className="flex w-24 items-center justify-center rounded-t-xl bg-primary-green p-1 text-sm font-bold text-white">
            <div>Documents</div>
          </div>
          <div className="mb-2 rounded-lg border shadow-md">
            <table className="min-w-full text-xs">
              <tbody>
                <tr>
                  <td className="w-1/2 border px-4 py-2 font-bold">
                    Driver License:
                  </td>
                  <td className="w-1/2 border px-4 py-2">
                    {documents.driverLicense}
                  </td>
                </tr>
                {general.type !== "Driver" && (
                  <>
                    <tr>
                      <td className="border px-4 py-2 font-bold">
                        Guide License:
                      </td>
                      <td className="border px-4 py-2">
                        {documents.guideLicense}
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className="border px-4 py-2 font-bold">
                    Vehicle Emission Test:
                  </td>
                  <td className="border px-4 py-2">
                    {documents.vehicleEmissionTest}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Insurance:</td>
                  <td className="border px-4 py-2">{documents.insurance}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Submit Button */}
      <div className="mt-4 flex w-full justify-center">
        <Button variant="primaryGreen" onClick={addDriver} disabled={loading}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default SubmitForm;
