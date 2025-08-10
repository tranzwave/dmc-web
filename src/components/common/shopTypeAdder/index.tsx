"use client";
import { useOrganization } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet";
import { SelectShopType } from "~/server/db/schemaTypes";
import LoadingLayout from "../dashboardLoading";
import { createShopType, getAllShopTypes } from "~/server/db/queries/shops";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { isValidInput, sanitizeInput } from "~/lib/utils/index";
import { toast } from "~/hooks/use-toast";
import { set } from "date-fns";

const ShopTypeAdder = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [shopTypes, setShopTypes] = useState<SelectShopType[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredShopTypes, setFilteredShopTypes] = useState<SelectShopType[]>([]);
    const { organization, isLoaded } = useOrganization();
    const [newShopType, setNewShopType] = useState<string>('');
    const [saving, setSaving] = useState<boolean>(false);
    const router = useRouter();
    const [inputError, setInputError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const country = organization?.publicMetadata.country as string ?? "LK";
                const shopTypesResponse = await getAllShopTypes();

                if (!shopTypesResponse) {
                    throw new Error("Error fetching shop types");
                }

                console.log("Fetched shop types:", shopTypesResponse);
                setShopTypes(shopTypesResponse);
                setFilteredShopTypes(shopTypesResponse);
                router.refresh();
            } catch (error) {
                console.error(error);
                setError("Failed to fetch shop types");
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded) {
            fetchData();
        }
    }, [isLoaded]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredShopTypes(shopTypes.filter(shopType => shopType.name.toLowerCase().includes(query)));
    };

    const handleShopTypeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setNewShopType(query);
    }

    const handleAddShopType = async () => {
        try {
            if(!isValidInput(newShopType)) {
                toast({
                    title: "Invalid city name",
                    description: "Please enter a valid city name.",
                })
                setSaving(false);
                setInputError("Invalid city name");
                return;
            }
            setSaving(true);
            const country = organization?.publicMetadata.country as string ?? "LK";
            const shopTypeExists = shopTypes.find(shopType => shopType.name.toLowerCase() === newShopType.toLowerCase());

            if (shopTypeExists) {
                toast({
                    title: "Shop type already exists",
                    description: "Please enter a different shop type.",
                })
                setInputError("Shop type already exists");
                throw new Error("Shop type already exists");
            }

            // make new shop type name sentence case
            const shopTypeName = newShopType.charAt(0).toUpperCase() + newShopType.slice(1);

            const response = await createShopType({
                name: sanitizeInput(shopTypeName),
            });

            if (!response[0]) {
                throw new Error("Failed to add shop type");
            }
            setShopTypes([...shopTypes, response[0]]);
            setFilteredShopTypes([...filteredShopTypes, response[0]]);

            setSaving(false);
        } catch (error) {
            console.error(error);
            setInputError("Failed to add shop type");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="text-[13px] cursor-pointer">Loading the shop type adder</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="text-[13px] cursor-pointer">Click here to add a missing shop type</div>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Shop Types</SheetTitle>
                    <SheetDescription>
                        Make changes to your shop types here.
                    </SheetDescription>
                </SheetHeader>
                <div className="my-2 flex flex-col gap-2">
                    <div>
                        <Label htmlFor="shopType">Add a new shop type</Label>
                        <Input id="shopType" onChange={handleShopTypeInput} />
                        {inputError && <span className="text-red-500 text-[10px] -mt-2">*{inputError}</span>}
                    </div>
                    <div className="w-full flex justify-end">
                        <Button variant={"primaryGreen"} onClick={handleAddShopType} disabled={saving}>
                            {saving ? (
                                <div className="flex flex-row items-center">
                                    <LoaderCircle size={16} className="mr-2 animate-spin" />
                                    <span>Adding</span>
                                </div>
                            ) : "Add Shop Type"}
                        </Button>
                    </div>
                </div>
                <div className="my-2">
                    <Label htmlFor="search">Search Shop Types</Label>
                    <Input
                        id="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search shop types"
                        className="w-[80%]"
                    />
                </div>
                <div className="flex flex-col max-h-[500px] overflow-y-scroll text-[13px] mt-5">
                    <div>
                        {filteredShopTypes.map((shopType) => (
                            <div key={shopType.id}>{shopType.name}</div>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default ShopTypeAdder;