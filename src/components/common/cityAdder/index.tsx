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
import { SelectCity } from "~/server/db/schemaTypes";
import LoadingLayout from "../dashboardLoading";
import { getAllCities } from "~/server/db/queries/restaurants";
import { set } from "date-fns";
import { create } from "domain";
import { createCity } from "~/server/db/queries/cities";
import { LoaderCircle } from "lucide-react";
import { toast } from "~/hooks/use-toast";
import { isValidInput } from "~/lib/utils/index";

const CityAdder = () => {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState<SelectCity[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCities, setFilteredCities] = useState<SelectCity[]>([]);
    const { organization, isLoaded } = useOrganization();
    const [newCity, setNewCity] = useState<string>('');
    const [saving, setSaving] = useState<boolean>(false);

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

    const handleCityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setNewCity(query);
    }

    const handleAddCity = async () => {
        try {
            setSaving(true);
            if(!isValidInput(newCity)) {
                toast({
                    title: "Invalid city name",
                    description: "Please enter a valid city name.",
                })
                setSaving(false);
                return;
            }
            const country = organization?.publicMetadata.country as string ?? "LK";
            const cityExists = cities.find(city => city.name.toLowerCase() === newCity.toLowerCase());

            if (cityExists) {
                toast({
                    title: "City already exists",
                    description: "Please select a different city.",
                })
                throw new Error("City already exists");
            }

            // make new city name sentence case
            const cityName = newCity.charAt(0).toUpperCase() + newCity.slice(1);

            const response = await createCity(cityName, country);

            if (!response[0]) {
                throw new Error("Failed to add city");
            }
            setCities([...cities, response[0]]);
            setFilteredCities([...filteredCities, response[0]]);

            setSaving(false);
        } catch (error) {
            console.error(error);
            setError("Failed to add city");
        } finally {
            setSaving(false);
        }
    }

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
                        <Input id="city" onChange={handleCityInput} />
                    </div>
                    <div className="w-full flex justify-end">
                        <Button variant={"primaryGreen"} onClick={handleAddCity} disabled={saving}>
                            {saving ? (
                                <div className="flex flex-row items-center">
                                    <LoaderCircle size={16} className="mr-2 animate-spin" />
                                    <span>Adding</span>
                                </div>
                            ) : "Add City"}
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
                        {filteredCities.map((city) => (
                            <div key={city.id}>{city.name}</div>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
  export default CityAdder;