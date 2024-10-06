"use client";

import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TitleBar from "~/components/common/titleBar";
import GeneralTab from "~/components/shops/addShop/forms/generalForm";
import SubmitForm from "~/components/shops/addShop/forms/submitForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getShopDataById } from "~/server/db/queries/shops";
import { AddShopProvider, useAddShop } from "../../add/context";
import { FetchedShopData } from "../page";

const EditShop = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { shopDetails, activeTab, setActiveTab, setGeneralDetails } =
    useAddShop();
  const [shop, setShop] = useState<FetchedShopData>();
  const [isGeneralDetailsSet, setIsGeneralDetailsSet] =
    useState<boolean>(false); // State to control rendering

  const fetchShop = async () => {
    try {
      setLoading(true);
      const selectedShop = await getShopDataById(id);
      console.log(selectedShop)
      if (!selectedShop) {
        throw new Error("Couldn't find activity vendor");
      }

      const { city, shopVouchers, ...general } = selectedShop;
      setShop(selectedShop);

      const formattedShopTypes = general.shopTypes && general.shopTypes.length > 0
      ? general.shopTypes.map((shopType: any) => ({
          id: shopType.id,
          name: shopType.name,
        }))
      : [];  // Handle empty array

      setGeneralDetails({
        cityId: general.cityId,
        contactNumber: general.contactNumber,
        name: general.name,
        province: general.province,
        streetName: general.streetName,
        tenantId: general.tenantId,
        city: city,
        shopTypes: formattedShopTypes, // Pass the formatted shopTypes here

      });
      setIsGeneralDetailsSet(true); // Mark as ready to render GeneralTab

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch driver details:", error);
      setError("Failed to load driver details.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Add Shop Component");
    fetchShop();
  }, [id]);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar
              title={`Edit shop - ${shop?.name ?? ""}`}
              link="toEditShop"
            />
            {/* <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div> */}
          </div>
          <div className="w-full">
            <Tabs
              defaultValue="general"
              className="w-full border"
              value={activeTab}
            >
              <TabsList className="flex w-full justify-evenly">
                <TabsTrigger
                  value="general"
                  isCompleted={false}
                  onClick={() => setActiveTab("general")}
                  inProgress={activeTab == "general"}
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="submit"
                  isCompleted={false}
                  disabled={shopDetails.general.name.length == 0}
                >
                  Submit
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {isGeneralDetailsSet ? (
                  <GeneralTab />
                ) : (
                  <div>Loading General Details...</div>
                )}
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                {/* <GeneralTab /> */}
              </TabsContent>
              <TabsContent value="submit">
                <SubmitForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedAddShop() {
  const { id } = useParams();
  return (
    <AddShopProvider>
      {id ? <EditShop id={id as string} /> : <div>No shop ID provided</div>}
    </AddShopProvider>
  );
}
