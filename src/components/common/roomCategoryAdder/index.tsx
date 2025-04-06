"use client";
import { useOrganization } from "@clerk/nextjs";
import { use, useEffect, useState } from "react";
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet"
import { SelectCity, SelectHotelRoomCategory } from "~/server/db/schemaTypes";
import LoadingLayout from "../dashboardLoading";
import { getAllCities } from "~/server/db/queries/restaurants";
import { set } from "date-fns";
import { create } from "domain";
import { createCity } from "~/server/db/queries/cities";
import { LoaderCircle } from "lucide-react";
import { createRoomCategory, getAllRoomCategories } from "~/server/db/queries/roomCategories";

const RoomCategoryAdder = () => {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [roomCategories, setRoomCategories] = useState<SelectHotelRoomCategory[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRoomCategories, setFilteredRoomCategories] = useState<SelectHotelRoomCategory[]>([]);
    const { organization, isLoaded } = useOrganization();
    const [newRoomCategory, setNewRoomCategory] = useState<string>('');
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(!organization) {
                    return;
                }
                setLoading(true);
                const categoriesResponse = await getAllRoomCategories(organization.id);

                if (!categoriesResponse) {
                    throw new Error("Error fetching room categories");
                }

                console.log("Fetched cities:", categoriesResponse);
                setRoomCategories(categoriesResponse);
                setFilteredRoomCategories(categoriesResponse);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch room categories");
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded) {
            fetchData();
        }
    }, [organization, isLoaded]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredRoomCategories(roomCategories.filter(category => category.name.toLowerCase().includes(query)));
    };

    const handleCityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setNewRoomCategory(query);
    }

    const handleAddRoomCategories = async () => {
        try {
            if(!organization) {
                return;
            }
            setSaving(true);
            const country = organization?.publicMetadata.country as string ?? "LK";
            const cityExists = roomCategories.find(category => category.name.toLowerCase() === newRoomCategory.toLowerCase());

            if (cityExists) {
                throw new Error("Category already exists");
            }

            //make category name all words first letter capitalized
            const roomCategoryName = newRoomCategory.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            const response = await createRoomCategory(organization?.id, roomCategoryName)

            if (!response[0]) {
                throw new Error("Failed to add category");
            }
            setRoomCategories([...roomCategories, response[0]]);
            setFilteredRoomCategories([...filteredRoomCategories, response[0]]);

            setSaving(false);
        } catch (error) {
            console.error(error);
            setError("Failed to add category");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        <div className="text-[13px] cursor-pointer">Loading the room category adder</div>
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="text-[13px] cursor-pointer">Click here to add a custom room category</div>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Custom Room Categories</SheetTitle>
                    <SheetDescription>
                        Please note that you can't edit or delete the default room categories.
                    </SheetDescription>
                </SheetHeader>
                <div className="my-2 flex flex-col gap-2">
                    <div>
                        <Label htmlFor="category">Add a new room category</Label>
                        <Input id="category" onChange={handleCityInput} />
                    </div>
                    <div className="w-full flex justify-end">
                        <Button variant={"primaryGreen"} onClick={handleAddRoomCategories} disabled={saving}>
                            {saving ? (
                                <div className="flex flex-row items-center">
                                    <LoaderCircle size={16} className="mr-2 animate-spin" />
                                    <span>Adding</span>
                                </div>
                            ) : "Add Category"}
                        </Button>
                    </div>
                </div>
                <div className="my-2">
                        <Label htmlFor="search">Search Room Categories</Label>
                        <Input
                            id="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search Categories"
                            className="w-[80%]"
                        />
                    </div>
                <div className="flex flex-col max-h-[500px] overflow-y-scroll text-[13px] mt-5">
                    <div>
                        {filteredRoomCategories.map((category) => (
                            <div key={category.id}>{category.name}</div>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
  export default RoomCategoryAdder;