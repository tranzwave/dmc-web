import { useUser, useClerk } from "@clerk/nextjs";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ClerkUserPublicMetadata } from "~/lib/types/payment";
import UpdateCard from "./updateCard";
import { updateUserPublicMetadata } from "~/server/auth";
// import { Button, Input, Label } from "@clerk/elements";

const CustomPage = () => {
    const { user, isLoaded } = useUser();

    // State for form fields
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [fax, setFax] = useState("");
    const [showAddressEdit, setShowAddressEdit] = useState(false);
    const [showContactEdit, setShowContactEdit] = useState(false);
    const [saving, setSaving] = useState(false);

    // Handle save
    const handleSave = async () => {
        try {
            if(!user) {
                throw new Error("User not found.");
            }
            setSaving(true);
            const existingMetadata = user.publicMetadata as ClerkUserPublicMetadata;
            const response = await updateUserPublicMetadata(user.id, {
                ...existingMetadata,
                info: {
                    address: address,
                    contact: contactNumber,
                }
            });

            if(!response) {
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

    useEffect(() => {
        if (user) {
            const metadata = user.publicMetadata as ClerkUserPublicMetadata;
            setAddress(metadata.info.address);
            setContactNumber(metadata.info.contact);
        }
    }
        , [user]);



    return (
        <div className="max-w-full">
            <div className="text-[17px] font-semibold pb-4 border-b">Personal Info</div>

            {/* Address */}
            <div className="py-4 border-b text-[13px] flex flex-row justify-between">
                <div className="block mb-1 font-medium w-[35%]">Address</div>
                {!showAddressEdit ? (
                    <div className="w-full flex flex-row justify-between">
                        <div className="font-base w-[58%]">{address}</div>
                        <div className="font-base text-primary-green flex flex-row justify-end w-[42%] hover:cursor-pointer" onClick={() => {
                            setShowContactEdit(false)
                            setShowAddressEdit(true)
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
                            setShowAddressEdit(false)
                            setShowContactEdit(true)
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
        </div>
    );
};


export default CustomPage;
