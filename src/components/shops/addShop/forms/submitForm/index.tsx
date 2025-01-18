"use client";
import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAddShop } from "~/app/dashboard/shops/add/context";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { insertShop } from "~/server/db/queries/shops";

const SubmitForm = () => {
  const { shopDetails } = useAddShop();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = async () => {
    // Handle the submission of activityDetails
    console.log("Submitting shop details:", shopDetails);
    setLoading(true);
    try {
      let response;
      // Replace insertActivity with your function to handle the insertion of activity details
      if (pathname.includes("/edit")) {
        setLoading(false);
        alert("Updated");
        return;
      } else {
        response = await insertShop([shopDetails]);
      }

      if (!response) {
        throw new Error(`Error: Inserting Shop`);
      }

      console.log("Success:", response);

      setLoading(false);
      // Handle successful response (e.g., show a success message)
      toast({
        title: "Success",
        description: "Shop added successfully",
      });
      router.push("/dashboard/shops");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
      setLoading(false);
      toast({
        title: "Uh Oh!",
        description: "Error while adding the shop",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex w-24 items-center justify-center rounded-t-xl bg-primary-green p-1 text-sm font-bold text-white">
        <div>General</div>
      </div>

      <div className="mb-2 rounded-lg border shadow-md">
        <table className="min-w-full text-xs">
          <tbody>
            <tr>
              <td className="w-1/2 border px-4 py-2 font-bold">Name:</td>
              <td className="w-1/2 border px-4 py-2">
                {shopDetails.general.name}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Contact Number:</td>
              <td className="border px-4 py-2">
                {shopDetails.general.contactNumber}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Street Name:</td>
              <td className="border px-4 py-2">
                {shopDetails.general.streetName}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">City:</td>
              <td className="border px-4 py-2">
                {shopDetails.general.city?.name}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Province:</td>
              <td className="border px-4 py-2">
                {shopDetails.general.province}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Shop Types</td>
              <td className="border px-4 py-2">
                {shopDetails.general.shopTypes &&
                shopDetails.general.shopTypes.length > 0
                  ? shopDetails.general.shopTypes
                      .map((type) => type.name)
                      .join(", ")
                  : "No shop types available"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex w-full justify-center">
        <Button
          variant="primaryGreen"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin" size={18} />}{" "}
          Submit
        </Button>
      </div>
    </div>
  );
};

export default SubmitForm;
