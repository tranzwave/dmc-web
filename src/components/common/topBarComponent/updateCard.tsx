import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import "react-phone-input-2/lib/style.css";

interface UpdateCardProps {
    title: string;
    exisitingValue: string;
    setValue: (address: string) => void;
    setShowCard: (show: boolean) => void;
    handleSave: () => void;
    isSaving: boolean;
}

const UpdateCard = ({
    title,
    exisitingValue,
    setValue,
    setShowCard,
    handleSave,
    isSaving
}: UpdateCardProps) => {
    return (
        <div className="w-full border rounded-md shadow-md p-3 flex flex-col gap-2">
            <div className="font-semibold">Update {title.toLowerCase()}</div>
            <div className="flex flex-col gap-1">
                <div className="font-medium">{title}</div>
                {title === "Contact" ? (
                    <PhoneInput
                        country={"us"}
                        value={exisitingValue}
                        onChange={(phone) => setValue(`+${phone}`)}
                        inputClass="w-full shadow-md"
                        inputStyle={{ width: "inherit" }}
                    />
                ) : (
                    <Input
                        className="w-full h-9 rounded-md border text-[13px]"
                        type="text"
                        value={exisitingValue}
                        onChange={(e) => setValue(e.target.value)}
                    />

                )}
            </div>
            <div className="flex flex-row justify-end items-center mt-2 gap-2">
                <Button
                    onClick={() => setShowCard(false)}
                    variant={"primaryGreen"}
                    className="bg-white text-primary-green font-semibold text-[13px] h-8 hover:bg-primary-green/5"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant={"primaryGreen"}
                    className="bg-opacity-50 h-8 font-semibold text-[13px] hover:bg-primary-green/65"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <div className="flex flex-row gap-2 items-center">
                            <LoaderCircle size={16} className="animate-spin" />
                            <div>Saving</div>
                        </div>
                    ) : "Save"}
                </Button>
            </div>
        </div>
    );
};

export default UpdateCard;
