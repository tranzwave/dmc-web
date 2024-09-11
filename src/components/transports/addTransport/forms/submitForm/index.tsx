"use client"
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAddTransport } from "~/app/dashboard/transport/add/context";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { insertDriver } from "~/server/db/queries/transport";
import { InsertDriver, InsertLanguage, InsertVehicle } from "~/server/db/schemaTypes";

const SubmitForm = () => {
    const { transportDetails } = useAddTransport();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const { general, vehicles, charges, documents } = transportDetails;
    const router = useRouter()

    const addDriver = async () => {
        console.log({
          general,
          vehicles,
          charges,
          documents,
        });
        const driverData:InsertDriver[] = [{
            name: general.name,
            primaryEmail: general.primaryEmail,
            primaryContactNumber: general.primaryContactNumber,
            streetName: general.streetName,
            province: general.province,
            contactNumber: general.primaryContactNumber,
            tenantId: "",
            cityId: Number(general.city),
            driversLicense: documents.driverLicense,
            insurance: documents.insurance,
            isGuide: general.guide,
            guideLicense: documents.guideLicense,
            accommodationAllowance: charges.accommodationAllowance,
            fuelAllowance:charges.fuelAllowance,
            mealAllowance:charges.mealAllowance,
            feePerKM:charges.feePerKm
        }]
        
        const vehicleData:InsertVehicle[] = vehicles.map((v) => {
            return {
                make: v.make,
                model: v.model,
                numberPlate:v.numberPlate,
                seats:v.seats,
                vehicleType:v.vehicle,
                tenantId:"",
                year:Number(v.year),
                revenueLicense: v.vrl,
            }
        })

        const languages:InsertLanguage[] = [{
            name:"English",
            code: "en"
        }]
      
        try {
          // Replace insertDriver with your function to handle the insertion of driver details
          const response = await insertDriver(
            driverData,
            vehicleData,
            languages
            // charges,
            // documents,
          );
      
          if (!response) {
            throw new Error(`Error: ${response}`);
          }
      
          console.log("Success:", response);
      
          setLoading(false);
          // Handle successful response (e.g., show a success message)
          toast({
            title: "Success",
            description: "Driver added successfully",
          });
          router.push("dashboard/transport")
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("An unknown error occurred");
          }
          console.error("Error:", error);
          alert(error)
          setLoading(false);
          toast({
            title: "Uh Oh!",
            description: "Error while adding the driver",
          });
        } finally {
          setLoading(false);
        }
      };
      

    return (
        <div>
            {/* General Section */}
            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>General</div>
            </div>
            <div className="border rounded-lg mb-2 shadow-md">
                <table className="min-w-full text-xs">
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2 font-bold w-1/2 ">Name:</td>
                            <td className="border px-4 py-2 w-1/2 ">{general.name}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Language:</td>
                            <td className="border px-4 py-2">{general.language}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Email:</td>
                            <td className="border px-4 py-2">{general.primaryEmail}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Contact Number:</td>
                            <td className="border px-4 py-2">{general.primaryContactNumber}</td>
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

            {/* Vehicles Section */}
            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>Vehicles</div>
            </div>
            <div className="border rounded-lg mb-2 shadow-md">
                <table className="min-w-full text-xs">
                    <tbody>
                        {vehicles.length > 0 ? (
                            vehicles.map((vehicle, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <th className=" px-4 py-2 text-primary-green bg-secondary-green text-sm  font-bold" colSpan={2}>Vehicle {index + 1}</th>
                                    </tr>
                                    <tr className="grid-cols-2">
                                        <td className="border px-4 py-2 font-bold w-1/2 ">Vehicle:</td>
                                        <td className="border px-4 py-2 w-1/2 ">{vehicle.vehicle}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-4 py-2 font-bold">Number Plate:</td>
                                        <td className="border px-4 py-2">{vehicle.numberPlate}</td>
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
                                <td className="border px-4 py-2" colSpan={2}>No vehicles added</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Charges Section */}
            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>Charges</div>
            </div>
            <div className="border rounded-lg mb-2 shadow-md">
                <table className="min-w-full text-xs">
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2 font-bold w-1/2 ">Fee Per Km:</td>
                            <td className="border px-4 py-2 w-1/2 ">{charges.feePerKm}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Fuel Allowance:</td>
                            <td className="border px-4 py-2">{charges.fuelAllowance}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Accommodation Allowance:</td>
                            <td className="border px-4 py-2">{charges.accommodationAllowance}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Meal Allowance:</td>
                            <td className="border px-4 py-2">{charges.mealAllowance}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Documents Section */}
            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>Documents</div>
            </div>
            <div className="border rounded-lg mb-2 shadow-md">
                <table className="min-w-full text-xs">
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2 font-bold w-1/2 ">Driver License:</td>
                            <td className="border px-4 py-2 w-1/2 ">{documents.driverLicense}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Guide License:</td>
                            <td className="border px-4 py-2">{documents.guideLicense}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Vehicle Emission Test:</td>
                            <td className="border px-4 py-2">{documents.vehicleEmissionTest}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Insurance:</td>
                            <td className="border px-4 py-2">{documents.insurance}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Submit Button */}
            <div className="flex w-full justify-center mt-4">
                <Button variant="primaryGreen" onClick={addDriver} disabled={loading}>
                    {loading ? <LoaderCircle className="animate-spin"/> : 'Submit'}
                </Button>
            </div>
        </div>
    );
}

export default SubmitForm;
