import React from "react";
import Image from "next/image";
import { OrganizationResource } from "@clerk/types";

interface VoucherHeaderProps {
  organization: OrganizationResource;
}

const VoucherHeader: React.FC<VoucherHeaderProps> = ({ organization }) => {
    const orgData = {
        address: organization.publicMetadata.address as string ?? "Address",
        contactNumber: organization.publicMetadata.contactNumber as string ?? "Number",
        website: organization.publicMetadata.website as string ?? "Website"
      }
    
      const { imageUrl } = organization
      const params = new URLSearchParams()
    
      params.set('height', '200')
      params.set('width', '200')
      params.set('quality', '100')
      params.set('fit', 'crop')
    
      const imageSrc = `${imageUrl}?${params.toString()}`
  return (
    <div className="flex flex-col items-center justify-center bg-primary-green p-4">
      <Image src={imageSrc} height={50} width={100} alt="orgLogo" />
      {organization?.name && (
        <div className="text-base font-semibold text-white">
          {organization.name}
        </div>
      )}
      {orgData.address && orgData.contactNumber && orgData.website && (
        <>
          <div className="text-[13px] text-white">{orgData.address}</div>
          <div className="text-[13px] text-white">{orgData.contactNumber}</div>
          <div className="text-[13px] text-white">{orgData.website}</div>
        </>
      )}
    </div>
  );
};

export default VoucherHeader;
