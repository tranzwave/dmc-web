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
import { SelectActivityType, SelectCity } from "~/server/db/schemaTypes";
import LoadingLayout from "../dashboardLoading";
import { getAllCities } from "~/server/db/queries/restaurants";
import { set } from "date-fns";
import { create } from "domain";
import { createCity } from "~/server/db/queries/cities";
import { LoaderCircle } from "lucide-react";
import { createActivityType, getAllActivityTypes } from "~/server/db/queries/activities";
import { toast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { isValidInput } from "~/lib/utils/index";

interface ActivityAdderProps {
    setActivityTypeUpdated: () => void;
}

const ActivityAdder = ({setActivityTypeUpdated}: ActivityAdderProps) => {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [activityTypes, setActivityTypes] = useState<SelectActivityType[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredActivityTypes, setFilteredActivityTypes] = useState<SelectActivityType[]>([]);
    const { organization, isLoaded } = useOrganization();
    const [newActivityType, setNewActivityType] = useState<string>('');
    const [saving, setSaving] = useState<boolean>(false);
    const router = useRouter();


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const country = organization?.publicMetadata.country as string ?? "LK";
                const activityTypeResponse = await getAllActivityTypes();

                if (!activityTypeResponse) {
                    throw new Error("Error fetching cities");
                }

                console.log("Fetched cities:", activityTypeResponse);
                setActivityTypes(activityTypeResponse);
                setFilteredActivityTypes(activityTypeResponse);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch cities");
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
        setFilteredActivityTypes(activityTypes.filter(activityType => activityType.name.toLowerCase().includes(query)));
    };

    const handleActivityTypeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setNewActivityType(query);
    }

    const handleAddCity = async () => {
        try {
            if(!isValidInput(newActivityType)) {
                toast({
                    title: "Invalid activity type",
                    description: "Please enter a valid activity type.",
                })
                setSaving(false);
                return;
            }
            setSaving(true);
            const country = organization?.publicMetadata.country as string ?? "LK";
            const activityTypeExists = activityTypes.find(activityType => activityType.name.toLowerCase() === newActivityType.toLowerCase());

            if (activityTypeExists) {
                toast({
                    title: "Activity Type already exists",
                    description: "Please enter a valid activity type.",
                })
                throw new Error("Activity Type already exists");
            }

            // make new activity name sentence case
            const activityTypeName = newActivityType.charAt(0).toUpperCase() + newActivityType.slice(1);

            const response = await createActivityType(activityTypeName);

            if (!response[0]) {
                throw new Error("Failed to add activity");
            }
            setActivityTypes([...activityTypes, response[0]]);
            setFilteredActivityTypes([...filteredActivityTypes, response[0]]);

            setSaving(false);

            
        } catch (error) {
            console.error(error);
            setError("Failed to add activity");
        } finally {
            setSaving(false);
            setActivityTypeUpdated();
        }
    }

    if (loading) {
        <div className="text-[13px] cursor-pointer">Loading the activity adder</div>
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="text-[13px] cursor-pointer">Click here to add a missing activity type</div>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Activity Types</SheetTitle>
                    <SheetDescription>
                        Make changes to your activity types here.
                    </SheetDescription>
                </SheetHeader>
                <div className="my-2 flex flex-col gap-2">
                    <div>
                        <Label htmlFor="activity">Add a new Activity Type</Label>
                        <Input id="activity" onChange={handleActivityTypeInput} />
                    </div>
                    <div className="w-full flex justify-end">
                        <Button variant={"primaryGreen"} onClick={handleAddCity} disabled={saving}>
                            {saving ? (
                                <div className="flex flex-row items-center">
                                    <LoaderCircle size={16} className="mr-2 animate-spin" />
                                    <span>Adding</span>
                                </div>
                            ) : "Add Activity"}
                        </Button>
                    </div>
                </div>
                <div className="my-2">
                        <Label htmlFor="search">Search Cities</Label>
                        <Input
                            id="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search cities"
                            className="w-[80%]"
                        />
                    </div>
                <div className="flex flex-col max-h-[500px] overflow-y-scroll text-[13px] mt-5">
                    <div>
                        {filteredActivityTypes.map((activity) => (
                            <div key={activity.id}>{activity.name}</div>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
  export default ActivityAdder;