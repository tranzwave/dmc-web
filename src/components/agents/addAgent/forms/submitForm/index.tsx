import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAddAgent } from "~/app/dashboard/agents/add/context";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { insertAgent } from "~/server/db/queries/agents";
import { InsertAgent } from "~/server/db/schemaTypes";

const SubmitForm = () => {
    const { agentDetails } = useAddAgent();
    const { general } = agentDetails;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast()
    const router = useRouter()


    // const handleSubmit = async () => {
    //     console.log('Submitting agent details:', agentDetails);

    //         const agentData:InsertAgent[]= [{
    //             name: general.name,
    //             countryCode: general.countryCode,
    //             email: general.email,
    //             tenantId: general.tenantId,
    //             agency: general.agency,
    //             primaryContactNumber: general.primaryContactNumber,
    //         }]
            
    //         try{
    //             const response = await insertAgent(
    //                 agentData
    //             )

    //             if(!response){
    //                 throw new Error(`Error: ${response}`)
    //             }
    //             console.log("Success:", response)
    //             setLoading(false)
    //             toast({
    //                 title: "Success",
    //                 description: "Agent added successfully"
    //             })
    //             router.push("dashboard/agents")
    //         }catch(error){
    //             if(error instanceof Error){
    //                 setError(error.message)
    //             }else{
    //                 setError("An unknown error occured")
    //             }
    //             console.error("Error:", error),
    //             alert(error)
    //             setLoading(false)
    //             toast({
    //                 title: "Uh Oh!",
    //                 description: "Error while adding the agent",
    //             })
    //         }finally{
    //             setLoading(false)
    //         }
    // };

    const handleSubmit = async () => {
        console.log('Submitting agent details:', agentDetails);
    
        const agentData: InsertAgent[] = [{
            name: general.name,
            countryCode: general.countryCode,
            email: general.email,
            tenantId: "",
            agency: general.agency,
            primaryContactNumber: general.primaryContactNumber,
        }];
        
        try {
            await insertAgent(agentData); // No need to store response since it returns void
    
            console.log("Success");
            setLoading(false);
            toast({
                title: "Success",
                description: "Agent added successfully",
            });
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
            console.error("Error:", error);
            alert(error);
            setLoading(false);
            toast({
                title: "Uh Oh!",
                description: "Error while adding the agent",
            });
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div>
            <div className="bg-primary-green text-white font-bold text-sm p-1 rounded-t-xl w-24 flex justify-center items-center">
                <div>General</div>
            </div>
            
            <div className="border rounded-lg mb-2 shadow-md">
                <table className="min-w-full text-xs">
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2 font-bold w-1/2">Name:</td>
                            <td className="border px-4 py-2 w-1/2">{general.name}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Country:</td>
                            <td className="border px-4 py-2">{general.countryCode}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Primary Email:</td>
                            <td className="border px-4 py-2">{general.email}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Contact Number:</td>
                            <td className="border px-4 py-2">{general.primaryContactNumber}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-bold">Agency</td>
                            <td className="border px-4 py-2">{general.agency}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex w-full justify-center mt-4">
                <Button variant="primaryGreen" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </div>
    );
}

export default SubmitForm;
