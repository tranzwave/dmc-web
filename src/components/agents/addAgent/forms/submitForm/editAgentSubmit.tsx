"use client"
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AgentData } from "~/app/dashboard/agents/[id]/edit/page";
import { useAddAgent } from "~/app/dashboard/agents/add/context";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { updateAgent } from "~/server/db/queries/agents";
import { InsertAgent } from "~/server/db/schemaTypes";

const EditAgentSubmitForm = ({ id, originalAgentData }: { id: string; originalAgentData: AgentData | null }) => {
  const { agentDetails } = useAddAgent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { general } = agentDetails;
  const router = useRouter();

  const updatedAgent = async () => {
    console.log({ general });

    const agentData: InsertAgent[] = [{
        name: general.name,
        countryCode: general.countryCode,
        email: general.email,
        agency: general.agency,
        primaryContactNumber: general.primaryContactNumber,
        tenantId: "",
        createdAt: originalAgentData?.createdAt ?? new Date(),
        id: originalAgentData?.id ?? "",
    }];

    try {
      const response = await updateAgent(id, agentData[0] ?? null);

      if (!response) {
        throw new Error("Error: Failed to update agent");
      }

      console.log("Success:", response);
      setLoading(false);

      toast({
        title: "Success",
        description: "Agent updated successfully"
      });

      router.push("/dashboard/agents");
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
        description: "Error while updating the agent",
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
              <td className="border px-4 py-2 font-bold w-1/2">Name:</td>
              <td className="border px-4 py-2 w-1/2">{general.name}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Agency:</td>
              <td className="border px-4 py-2">{general.agency}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Email:</td>
              <td className="border px-4 py-2">{general.email}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Contact Number:</td>
              <td className="border px-4 py-2">{general.primaryContactNumber}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Country Code:</td>
              <td className="border px-4 py-2">{general.countryCode}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="flex w-full justify-center mt-4">
        <Button variant="primaryGreen" onClick={updatedAgent} disabled={loading}>
          {loading ? <LoaderCircle className="animate-spin" /> : 'Submit'}
        </Button>
      </div>
    </div>
  );
};

export default EditAgentSubmitForm;
