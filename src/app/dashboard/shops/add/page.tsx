"use client";

import Link from "next/link";
import { useEffect } from "react";
import TitleBar from "~/components/common/titleBar";
import GeneralTab from "~/components/shops/addShop/forms/generalForm";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AddShopProvider, useAddShop } from "./context";
ddShopProvider, useAddShop } from "./context";

const AddShop = () => {
  const pathname = usePathname();
  const { shopDetails, activeTab, setActiveTab } = useAddShop();
  useEffect(() => {
    console.log("Add Shop Component");
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-row justify-between gap-1">
            <TitleBar title="Add Shop" link="toAddShop" />
            <div>
              <Link href={`${pathname}`}>
                <Button variant="link">Finish Later</Button>
              </Link>
            </div>
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
                  disabled={shopDetails.shopTypes.length == 0}
                >
                  Submit
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                {/* <GeneralTab onSetDetails={setGeneralDetails} /> */}
                <GeneralTab />
              </TabsContent>
              <TabsContent value="submit">{/* <SubmitForm /> */}</TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WrappedAddShop() {
  return (
    <AddShopProvider>
      <AddShop />
    </AddShopProvider>
  );
}
