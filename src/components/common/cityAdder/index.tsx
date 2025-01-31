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
import { SelectCity } from "~/server/db/schemaTypes";
import LoadingLayout from "../dashboardLoading";
import { getAllCities } from "~/server/db/queries/restaurants";

export function CityAdder() {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState<SelectCity[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCities, setFilteredCities] = useState<SelectCity[]>([]);
    const { organization, isLoaded } = useOrganization();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const country = organization?.publicMetadata.country as string ?? "LK";
                const citiesResponse = await getAllCities(country);

                if (!citiesResponse) {
                    throw new Error("Error fetching cities");
                }

                console.log("Fetched cities:", citiesResponse);
                setCities(citiesResponse);
                setFilteredCities(citiesResponse);
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
        setFilteredCities(cities.filter(city => city.name.toLowerCase().includes(query)));
    };

    if (loading) {
        <div className="text-[13px] cursor-pointer">Loading the city adder</div>
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="text-[13px] cursor-pointer">Click here to add a missing city</div>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Cities {cities ? ` - ${cities[0]?.country}` : ''}</SheetTitle>
                    <SheetDescription>
                        Make changes to your cities here.
                    </SheetDescription>
                </SheetHeader>
                <div className="my-2 flex flex-col gap-2">
                    <div>
                        <Label htmlFor="city">Add a new city</Label>
                        <Input id="city" />
                    </div>
                    <div className="w-full flex justify-end">
                        <Button variant={"primaryGreen"}>Add City</Button>
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
                        {filteredCities.map((city) => (
                            <div key={city.id}>{city.name}</div>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
