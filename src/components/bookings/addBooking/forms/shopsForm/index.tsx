'use client';
import { useState } from "react";
import { DataTable } from "~/components/bookings/home/dataTable";
import { columns, Shop } from "./columns";
import ShopsForm from "./shopsForm";
import { SearchIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAddBooking } from "~/app/dashboard/bookings/add/context";
import { searchShopsData, ShopsSearchParams } from "~/lib/api";

const ShopsTab = () => {
    const { addShop,bookingDetails } = useAddBooking();
    const [searchResults, setSearchResults] = useState<Shop[]>([]);
    const [searchDetails, setSearchDetails] = useState<Shop | null>(null);

    const handleRowClick = (shop: Shop) => {
        if (searchDetails) {
            // setSearchDetails(shop)
            addShop(shop);
        }
    };

    const updateSearchData = (shop: Shop) => {
        setSearchDetails(shop);
        const searchParams: ShopsSearchParams = {
            shopType: shop.shopType,
            city: shop.city,
            productType: shop.productType
        };
        searchShops(searchParams);
    };

    // Function to search for drivers based on transport data
    const searchShops = async (searchParams: ShopsSearchParams) => {
        try {
            const results = await searchShopsData(searchParams);
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching for drivers:", error);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className='flex flex-row gap-2 justify-center mx-9'>
                <div className='w-[25%]'>
                    <div className='card'>
                        Calendar
                    </div>
                    <div className="card">
                        Profile
                    </div>
                </div>
                <div className='card w-[70%] space-y-6'>
                    <div className='card-title'>Shop Information</div>
                    <ShopsForm onAddShop={updateSearchData} />
                    <div className='w-full space-y-2'>
                        <div className="flex flex-row justify-between items-center">
                            <div>
                                Shop - Mall
                            </div>
                            <div className="flex flex-row gap-2 items-center rounded-lg border px-4 py-2">
                                <SearchIcon size={18} color="#697077" />
                                <div className="font-sans font-light text-[#697077] text-sm">
                                    Search for a shop here
                                </div>
                            </div>
                        </div>
                        <DataTable columns={columns} data={searchResults} onRowClick={handleRowClick}/>
                    </div>
                    <div className='w-full'>
                        <DataTable columns={columns} data={bookingDetails.shops} />
                    </div>
                    <div className="w-full flex justify-end">
                        <Button variant={"primaryGreen"}>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopsTab;
