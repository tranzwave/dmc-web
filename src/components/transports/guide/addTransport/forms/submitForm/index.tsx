"use client"
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAddGuideTransport } from "~/app/dashboard/transport/guide/add/context";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { insertGuide } from "~/server/db/queries/transport";
import { InsertGuide, InsertLanguage } from "~/server/db/schemaTypes";

const SubmitForm = () => {
    const { transportDetails } = useAddGuideTransport();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const { general, documents } = transportDetails;
    const router = useRouter()

    const addGuide = async () => {
        console.log({
          general,
          documents,
        });
        const guideData:InsertGuide[] = [{
            name: general.name,
            primaryEmail: general.primaryEmail,
            primaryContactNumber: general.primaryContactNumber,
            streetName: general.streetName,
            province: general.province,
            tenantId: "",
            cityId: Number(general.city),
            type: general.type,
            guideLicense: documents.guideLicense
        }]

        const languages:InsertLanguage[] = [{
            name:"English",
            code: "en"
        }]
      
        try {
          // Replace insertDriver with your function to handle the insertion of driver details
          const response = await insertGuide(
            guideData,
            languages
            
          );
          if (!response) {
            throw new Error(`Error: ${response}`);
          }
      
          console.log("Success:", response);
      
          setLoading(false);
          // Handle successful response (e.g., show a success message)
          toast({
            title: "Success",
            description: "Guide added successfully",
          });
          router.push("/dashboard/transport")
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
            description: "Error while adding the guide",
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


            {/* Documents Section */}
            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>Documents</div>
            </div>
            <div className="border rounded-lg mb-2 shadow-md">
                <table className="min-w-full text-xs">
                    <tbody>
               
                        <tr>
                            <td className="border px-4 py-2 font-bold">Guide License:</td>
                            <td className="border px-4 py-2">{documents.guideLicense}</td>
                        </tr>
                      
                    </tbody>
                </table>
            </div>

            {/* Submit Button */}
            <div className="flex w-full justify-center mt-4">
                <Button variant="primaryGreen" onClick={addGuide} disabled={loading}>

                    {loading ? <LoaderCircle className="animate-spin"/> : 'Submit'}
                </Button>
            </div>
        </div>
    );
}

export default SubmitForm;
