"use client";

import { OrganizationResource } from "@clerk/types";
import TourInvoicesTable from "./tourInvoicesTable";
import { ClerkUserPublicMetadata } from "~/lib/types/payment";

interface TourInvoicesTabProps {
    organization: OrganizationResource;
    userMetadata: ClerkUserPublicMetadata;
    isSuperAdmin: boolean;
}


const TourInvoicesTab = ({organization, userMetadata, isSuperAdmin} : TourInvoicesTabProps) => {
  return (
    <div className="mx-9 flex flex-row justify-center gap-2">
      <div className="card w-[100%] space-y-6">
        {/* <div className="card-title">Hotels Bookings History</div> */}
        <TourInvoicesTable organization={organization} userMetadata={userMetadata} isSuperAdmin/>
      </div>
    </div>
  );
};

export default TourInvoicesTab;
