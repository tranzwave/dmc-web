import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEditBooking } from "~/app/dashboard/bookings/[id]/edit/context";
import {
  ShopVoucher,
} from "~/app/dashboard/bookings/add/context";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { getShopsByTypeAndCity, getShopsWithFlexibleFilter } from "~/server/db/queries/shops";
import {
  SelectCity,
  SelectShop,
  SelectShopType
} from "~/server/db/schemaTypes";

export type ShopsData = SelectShop & {
  shopTypes: {
    shopTypeId: number,
    shopId: string,
    shopType: SelectShopType;
  }[];
  city: SelectCity;
};
interface ShopsFormProps {
  onAddShop: (shop: ShopVoucher) => void;
  shopTypes: SelectShopType[];
  cities: SelectCity[];
  isSaving: boolean
}

type ShopWithoutCityAndTypes = Omit<ShopsData, "city" | "shopTypes">;

export const shopsSchema = z.object({
  shopType: z.string().optional(),
  city: z.string().optional(),
  shop: z.string().min(1, "Shop is required"),
  date: z.string().min(1, "Date is required"),
  remarks: z.string().optional(), // Optional field
});

const ShopsForm: React.FC<ShopsFormProps> = ({
  onAddShop,
  shopTypes,
  cities,
  isSaving
}) => {
  const [shops, setShops] = useState<ShopsData[]>([]);
  const [selectedCity, setSelectedCity] = useState<SelectCity>();
  const [selectedShopType, setSelectedShopType] = useState<SelectShopType>();
  const [shopsLoading, setShopsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [selectedShop, setSelectedShop] = useState<ShopsData | null>();
  const { bookingDetails } = useEditBooking();
  const { organization } = useOrganization();
  const form = useForm<z.infer<typeof shopsSchema>>({
    resolver: zodResolver(shopsSchema),
    defaultValues: {
      shopType: "",
      city: "",
      shop: "",
      date: "",
      remarks: "",
    },
  });

  function onSubmit(values: z.infer<typeof shopsSchema>) {
    const {
      city,
      shopTypes,
      ...shopWithoutCityAndTypes
    }: ShopWithoutCityAndTypes | any = selectedShop;
    onAddShop({
      shop: shopWithoutCityAndTypes,
      voucher: {
        bookingLineId: "",
        coordinatorId: bookingDetails.general.marketingManager,
        shopId: shopWithoutCityAndTypes.id,
        date: values.date,
        time: "10:00",
        hours: 1,
        // participantsCount: bookingDetails.general.adultsCount + bookingDetails.general.kidsCount,
        adultsCount: bookingDetails.general.adultsCount,
        kidsCount:bookingDetails.general.kidsCount,
        city: selectedShop?.city.name ?? "",
        shopType: selectedShopType?.name ?? selectedShop?.shopTypes[0]?.shopType.name ?? "",
        remarks:values.remarks
      },
    });
    form.reset();
  }

  const fetchShops = async () => {
    try {
      // Allow searching with both "All" selections or with at least one specific filter
      const shopTypeSelected = form.getValues("shopType");
      const citySelected = form.getValues("city");
      
      // Only prevent search if neither filter is selected at all (not even "All")
      if (!shopTypeSelected && !citySelected) {
        setError("Please select at least one filter to search");
        return;
      }

      setShopsLoading(true);
      setError(undefined);
      
      const [shopsResponse] = await Promise.all([
        getShopsWithFlexibleFilter(
          selectedShopType?.id,
          selectedCity?.id,
          organization?.id,
        ),
      ]);

      if (!shopsResponse) {
        throw new Error("Couldn't get any shops");
      }

      console.log(shopsResponse);
      setShops(shopsResponse);
      setShopsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error fetching data:", error);
      setShopsLoading(false);
    }
  };

  const getCityId = (name: string) => {
    setSelectedShop(null);
    setShops([]);
    setShopsLoading(false);
    if (name === "all") {
      setSelectedCity(undefined);
    } else {
      const city = cities.find((city) => city.name === name);
      setSelectedCity(city);
    }
  };

  const getShopTypeId = (name: string) => {
    setSelectedShop(null);
    setShops([]);
    setShopsLoading(false);
    if (name === "all") {
      setSelectedShopType(undefined);
    } else {
      const type = shopTypes.find((type) => type.name === name);
      setSelectedShopType(type);
    }
  };

  const getShopId = (name: string) => {
    const shop = shops.find((shop) => shop.name === name);

    setSelectedShop(shop);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex w-full flex-row items-end gap-3">
          <div className="grid w-full grid-cols-2 gap-3">
            <FormField
              name="shopType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Type (Optional)</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Enter shop type" {...field} /> */}
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // getHotelId(value);
                        getShopTypeId(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Filter by shop type (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          All Shop Types
                        </SelectItem>
                        {shopTypes.map((shopType) => (
                          <SelectItem key={shopType.id} value={shopType.name}>
                            {shopType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Enter city" {...field} /> */}
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // getHotelId(value);
                        getCityId(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Filter by city (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          All Cities
                        </SelectItem>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-[10%] flex flex-col gap-1">
            <div className="text-xs text-gray-600 text-center">
              Select filters or "All"
            </div>
            <Button
              variant={"primaryGreen"}
              onClick={fetchShops}
              type="button"
              className="w-full"
            >
              {shopsLoading ? (
                shopsLoading && (
                  <div>
                    <LoaderCircle className="animate-spin" />
                  </div>
                )
              ) : (
                <div>Search</div>
              )}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        <div className="flex w-full flex-row items-center">
          <FormField
            name="shop"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Shop</FormLabel>
                <FormControl>
                  {/* <Input placeholder="Enter vendor" {...field} /> */}
                  {shopsLoading ? (
                    <div>Loading...</div>
                  ) : shops.length > 0 ? (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // getHotelId(value);
                        getShopId(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Select shop" />
                      </SelectTrigger>
                      <SelectContent>
                        {shops.map((shop) => (
                          <SelectItem key={shop.id} value={shop.name}>
                            {shop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder={`Select filters above and click search to find shops`}
                      {...field}
                      disabled={true}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Button variant={"outline"}>Search</Button> */}
        </div>
        <div className="grid grid-cols-4 gap-3">
          <FormField
            name="date"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "LLL dd, y")
                          ) : (
                            <span>Pick the date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          initialFocus
                          selected={
                            field.value
                              ? parse(field.value, "MM/dd/yyyy", new Date())
                              : new Date()
                          }
                          onSelect={(date: Date | undefined) => {
                            const dateString = format(
                              date ?? new Date(),
                              "MM/dd/yyyy",
                            );
                            field.onChange(dateString);
                          }}
                          disabled={(date) => {
                            const min = new Date(bookingDetails.general.startDate);
                            const max = new Date(bookingDetails.general.endDate)
                            min.setHours(0, 0, 0, 0);
                            max.setHours(0, 0, 0, 0)
                            return date < min || date > max;
                          }}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  {/* <Input
                        type="date"
                        {...field}
                        min={bookingDetails.general.startDate ?? ""}
                        max={bookingDetails.general.endDate ?? ""}
                      /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            name="time"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          {/* <FormField
            name="hours"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
        <FormField
          name="remarks"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Note</FormLabel>
              <FormControl>
                {/* <Input placeholder="Enter any special note" {...field} /> */}
                <textarea
                      placeholder="Enter any special notes"
                      {...field}
                      className="h-20 w-full rounded-md border border-gray-300 p-2 text-sm"
                    />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full flex-row justify-end">
          <Button variant={"primaryGreen"} type="submit" className="px-5" disabled={isSaving}>
          {isSaving ? (<div className="flex flex-row gap-1"><div><LoaderCircle className="animate-spin" size={15}/></div>Adding</div>): ('Add')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ShopsForm;
