"use client"
import { useOrganization } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAddGuideTransport } from "~/app/dashboard/transport/guide/add/context";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { getAllLanguages, insertGuide } from "~/server/db/queries/transport";
import { InsertGuide, InsertLanguage, SelectLanguage } from "~/server/db/schemaTypes";

const SubmitForm = () => {
    const { transportDetails } = useAddGuideTransport();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
    const { general, documents } = transportDetails;
    const router = useRouter()
    const {organization, isLoaded} = useOrganization();
    const [languages, setLanguages] = useState<SelectLanguage[]>([]);
    const [isFetchingLanguages, setIsFetchingLanguages] = useState(false);

    const addGuide = async () => {
        
      
        try {
            setLoading(true);
            if(!organization) {
                throw new Error("Organization not loaded")
            };
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
    
            const guidesLanguage:InsertLanguage[] = [{
                name:languages.find(lang => lang.id.toString() === general.language)?.name ?? (()=>{throw new Error("Language not found")})(),
                code: languages.find(lang => lang.id.toString() === general.language)?.code ?? (()=>{throw new Error("Language not found")})()
            }]

          // Replace insertDriver with your function to handle the insertion of driver details
          const response = await insertGuide(
            guideData,
            guidesLanguage,
            organization.id
            
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

    useEffect(() => {
        async function fetchLanguages() {
            try {
                setIsFetchingLanguages(true);
                const response = await getAllLanguages();
                if(!response) {
                    throw new Error("Failed to fetch languages")
                }
                setLanguages(response);
                setIsFetchingLanguages(false);
            } catch (error) {
                console.error("Failed to fetch languages:", error);
            } finally {
                setIsFetchingLanguages(false);
            }
        }

        fetchLanguages();
    }
    ,[]);
      
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
