"use client";
import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FetchedShopData } from "~/app/dashboard/shops/[id]/page";
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
  originalShopData?: FetchedShopData | null;
}) => {
  const { shopDetails } = useAddShop();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const general = shopDetails?.general;

  if (!general) {
    return <div>Error: Shop details are missing.</div>;
  }

  const updateShop = async () => {
    setLoading(true);
    console.log({ general });

    const cityId = general.city?.id ? Number(general.city.id) : 0;

    const shopData: InsertShop = {
      name: general.name,
      contactNumber: general.contactNumber,
      streetName: general.streetName,
      province: general.province,
      tenantId: "",
      cityId: cityId,
    };

    const shopType: InsertShopType[] = [
      {
        name: "Bookstore",
      },
    ];

    try {
      const response = await updateShopAndRelatedData(
        id,
        shopData,
        shopType,
      );

      if (!response) {
        throw new Error("Failed to update shop data.");
      }

      console.log("Success:", response);

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
                {general.name}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Contact Number:</td>
              <td className="border px-4 py-2">
                {general.contactNumber}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Street Name:</td>
              <td className="border px-4 py-2">
                {general.streetName}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">City:</td>
              <td className="border px-4 py-2">
                {general.city?.name}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Province:</td>
              <td className="border px-4 py-2">
                {general.province}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Shop Types:</td>
              <td className="border px-4 py-2">
                {general.shopTypes && general.shopTypes.length > 0
                  ? general.shopTypes.map((type) => type.name).join(", ")
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
