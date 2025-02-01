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
    <div className="flex flex-row justify-center items-center p-4 border-b border-black w-full gap-3">
      <div>
        <Image width={1000} height={100} src={imageUrl} alt="orgLogo" style={{ width: 'auto', height: '100px' }}/>
      </div>
      <div>
        <div className="flex flex-col justify-center">
          {organization?.name && (
            <div className="text-base font-semibold">
              {organization.name}
            </div>
          )}
          {orgData.address && orgData.contactNumber && orgData.website && (
            <div className="">
              <div className="text-[13px]">{orgData.address}</div>
              <div className="text-[13px]">{orgData.contactNumber}</div>
              <div className="text-[13px]">{orgData.website}</div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default VoucherHeader;
