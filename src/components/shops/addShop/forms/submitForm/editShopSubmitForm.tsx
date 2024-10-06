"use client";
import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAddShop } from "~/app/dashboard/shops/add/context";
import { ShopData } from "~/app/dashboard/shops/page";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { updateShopAndRelatedData } from "~/server/db/queries/shops";
import { InsertShop, InsertShopType } from "~/server/db/schemaTypes";

const EditShopSubmitForm = ({
  id,
  originalShopData,
}: {
  id: string;
  originalShopData: ShopData | null;
}) => {
  const { shopDetails } = useAddShop();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { general } = shopDetails;

  const updateShop = async () => {
    console.log({ general });

    // Ensure cityId is set correctly
    const cityId = general.city?.id ? Number(general.city.id) : 0; 

    const shopData: InsertShop[] = [
      {
        name: general.name,
        contactNumber: general.contactNumber,
        streetName: general.streetName,
        province: general.province,
        tenantId: "", 
        cityId: cityId,
      },
    ];

    const shopType: InsertShopType[] = [
      {
        name: "Bookstore", // Replace with dynamic shop type if needed
      },
    ];

    try {
      // Call the function to update shop and related data
      const response = await updateShopAndRelatedData(
        id,
        shopData[0] ?? null,
        shopType,
      );

      if (!response) {
        throw new Error(`Error: ${response}`);
      }

      console.log("Success:", response);

      // Handle successful response
      toast({
        title: "Success",
        description: "Shop updated successfully",
      });
      router.push("/dashboard/shops");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
      toast({
        title: "Uh Oh!",
        description: "Error while updating the shop",
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
              <td className="border px-4 py-2 font-bold">Shop Types:</td>
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
        <Button variant="primaryGreen" onClick={updateShop} disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" size={18} />}{" "}
          Submit
        </Button>
      </div>
    </div>
  );
};

export default EditShopSubmitForm;
