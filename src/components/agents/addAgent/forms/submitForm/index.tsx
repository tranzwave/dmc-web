import { useState } from "react";
import { useAddAgent } from "~/app/dashboard/agents/add/context";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { saveAgent } from "~/server/db/queries/agents";

const SubmitForm = () => {
    const { agentDetails } = useAddAgent();

    const { general } = agentDetails;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast()

    const handleSubmit = async () => {
        console.log('Submitting agent details:', agentDetails);
        setLoading(true);
        setError(null);

        try {
            const agentData = {
                name: general.name,
                countryCode: general.countryCode,
                email: general.email,
                tenantId: general.tenantId,
                agency: general.agency,
                primaryContactNumber: general.primaryContactNumber,
            };

            // Call the server-side function to save the agent data
            const response = await saveAgent(agentData);
            console.log("Agent saved successfully!");

            if (!response) {
                throw new Error(`Error: Inserting Agent Vendor`);
              }
          
              console.log("Success:", response);
          
              setLoading(false);
              // Handle successful response (e.g., show a success message)
              toast({
                title: "Success",
                description: "Agent added successfully",
              });

        } catch (err) {
            console.error("Failed to save agent:", err);
            setError("Failed to save agent. Please try again.");
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
