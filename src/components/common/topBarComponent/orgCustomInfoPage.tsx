import { useUser, useClerk, useOrganization } from "@clerk/nextjs";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ClerkOrganizationPublicMetadata, ClerkUserPublicMetadata } from "~/lib/types/payment";
import UpdateCard from "./updateCard";
import { updateOrganizationMetadata, updateUserPublicMetadata } from "~/server/auth";
// import { Button, Input, Label } from "@clerk/elements";

const OrgCustomPage = () => {
    // const { user, isLoaded } = useUser();
    const { organization, isLoaded } = useOrganization();

    // State for form fields
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [fax, setFax] = useState("");
    const [primaryCurrency, setPrimaryCurrency] = useState("");
    const [website, setWebsite] = useState("");

    const [showAddressEdit, setShowAddressEdit] = useState(false);
    const [showContactEdit, setShowContactEdit] = useState(false);
    const [showFaxEdit, setShowFaxEdit] = useState(false);
    const [showPrimaryCurrencyEdit, setShowPrimaryCurrencyEdit] = useState(false);
    const [showWebsiteEdit, setShowWebsiteEdit] = useState(false);


    const [saving, setSaving] = useState(false);

    // Handle save
    const handleSave = async () => {
        try {
            if (!organization) {
                throw new Error("Organization not found.");
            }
            setSaving(true);
            const existingMetadata = organization.publicMetadata as ClerkOrganizationPublicMetadata
            const response = await updateOrganizationMetadata(organization.id, {
                ...existingMetadata,
                contactNumber: contactNumber,
                address: address,
                website: website,
                fax: fax,
                primaryCurrency: primaryCurrency

            });

            if (!response) {
                throw new Error("Failed to update profile.");
            }

            setShowAddressEdit(false);
            setShowContactEdit(false);
            setSaving(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            setSaving(false);
        }
    };

    const toggleModal = (modalToMakeVisible: string) => {
        setShowAddressEdit(modalToMakeVisible === "address");
        setShowContactEdit(modalToMakeVisible === "contact");
        setShowFaxEdit(modalToMakeVisible === "fax");
        setShowWebsiteEdit(modalToMakeVisible === "website");
        setShowPrimaryCurrencyEdit(modalToMakeVisible === "primaryCurrency");
    };

    useEffect(() => {
        if (organization) {
            const metadata = organization.publicMetadata as ClerkOrganizationPublicMetadata;
            setAddress(metadata.address);
            setContactNumber(metadata.contactNumber);
            setFax(metadata.fax);
            setPrimaryCurrency(metadata.primaryCurrency);
            setWebsite(metadata.website);
        }
    }
        , [organization]);


    return (
        <div className="max-w-full">
            <div className="text-[17px] font-semibold pb-4 border-b">Organization Info</div>

            {/* Address */}
            <div className="py-4 border-b text-[13px] flex flex-row justify-between">
                <div className="block mb-1 font-medium w-[35%]">Address</div>
                {!showAddressEdit ? (
                    <div className="w-full flex flex-row justify-between">
                        <div className="font-base w-[58%]">{address}</div>
                        <div className="font-base text-primary-green flex flex-row justify-end w-[42%] hover:cursor-pointer" onClick={() => {
                            toggleModal("address")
                        }
                        }>Update Address</div>
                    </div>

                ) : (
                    <UpdateCard
                        title="Address"
                        exisitingValue={address}
                        setValue={setAddress}
                        setShowCard={setShowAddressEdit}
                        handleSave={handleSave}
                        isSaving={saving}
                    />
                )}
            </div>

            {/* Contact Number */}
            <div className="py-4 border-b text-[13px] flex flex-row justify-between">
                <div className="block mb-1 font-medium w-[35%]">Contact</div>
                {!showContactEdit ? (
                    <div className="w-full flex flex-row justify-between">
                        <div className="font-base w-[58%]">{contactNumber}</div>
                        <div className="font-base text-primary-green flex flex-row justify-end w-[42%] hover:cursor-pointer" onClick={() => {
                            toggleModal("contact")
                        }
                        }>
                            Update Contact
                        </div>
                    </div>

                ) : (
                    <UpdateCard
                        title="Contact"
                        exisitingValue={contactNumber}
                        setValue={setContactNumber}
                        setShowCard={setShowContactEdit}
                        handleSave={handleSave}
                        isSaving={saving}
                    />
                )}
            </div>

            {/* Fax */}
            <div className="py-4 border-b text-[13px] flex flex-row justify-between">
                <div className="block mb-1 font-medium w-[35%]">Fax</div>
                {!showFaxEdit ? (
                    <div className="w-full flex flex-row justify-between">
                        <div className="font-base w-[58%]">{fax}</div>
                        <div className="font-base text-primary-green flex flex-row justify-end w-[42%] hover:cursor-pointer" onClick={() => {
                            toggleModal("fax")
                        }
                        }>
                            Update Fax
                        </div>
                    </div>

                ) : (
                    <UpdateCard
                        title="Fax"
                        exisitingValue={fax}
                        setValue={setFax}
                        setShowCard={setShowFaxEdit}
                        handleSave={handleSave}
                        isSaving={saving}
                    />
                )}
            </div>

            {/* Website */}
            <div className="py-4 border-b text-[13px] flex flex-row justify-between">
                <div className="block mb-1 font-medium w-[35%]">Website</div>
                {!showWebsiteEdit ? (
                    <div className="w-full flex flex-row justify-between">
                        <div className="font-base w-[58%]">{website}</div>
                        <div className="font-base text-primary-green flex flex-row justify-end w-[42%] hover:cursor-pointer" onClick={() => {
                            toggleModal("website")
                        }
                        }>
                            Update Website
                        </div>
                    </div>

                ) : (
                    <UpdateCard
                        title="Website"
                        exisitingValue={website}
                        setValue={setWebsite}
                        setShowCard={setShowWebsiteEdit}
                        handleSave={handleSave}
                        isSaving={saving}
                    />
                )}
            </div>

            {/* Primary Currency */}
            <div className="py-4 border-b text-[13px] flex flex-row justify-between">
                <div className="block mb-1 font-medium w-[35%]">Primary Currency</div>
                {!showPrimaryCurrencyEdit ? (
                    <div className="w-full flex flex-row justify-between">
                        <div className="font-base w-[58%]">{primaryCurrency}</div>
                        <div className="font-base text-primary-green flex flex-row justify-end w-[42%] hover:cursor-pointer" onClick={() => {
                            toggleModal("primaryCurrency")
                        }
                        }>
                            Update Primary Currency
                        </div>
                    </div>

                ) : (
                    <UpdateCard
                        title="Primary Currency"
                        exisitingValue={primaryCurrency}
                        setValue={setPrimaryCurrency}
                        setShowCard={setShowPrimaryCurrencyEdit}
                        handleSave={handleSave}
                        isSaving={saving}
                    />
                )}
            </div>

        </div>
    );
};


export default OrgCustomPage;
