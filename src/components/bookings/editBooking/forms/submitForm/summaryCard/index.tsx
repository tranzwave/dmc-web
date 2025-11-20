import React from "react";
import { BookingSummary } from "~/app/dashboard/bookings/add/context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

interface SummaryCardProps {
  summary: BookingSummary;
}
export const formatDateToWeekdayMonth = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // "Sat"
    month: "short", // "Sep"
    day: "2-digit", // "21"
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  const { day, date, hotel, restaurants, activities, transport, shops } = summary;
  const dateValue = formatDateToWeekdayMonth(date);

  const isCancelled = (item: any) => {
    if (!item) return false;
    const candidates: any[] = [];
    if (item.voucher) candidates.push(item.voucher.status, item.voucher.voucherStatus);
    if (item.voucherLines && item.voucherLines.length > 0) candidates.push(item.voucherLines[0].status, item.voucherLines[0].voucherStatus);
    if (item.status) candidates.push(item.status, item.voucherStatus);
    return candidates.some((c) => typeof c === "string" && /cancel/i.test(c));
  };

  const hotelToShow = hotel && !isCancelled(hotel) ? hotel : null;
  const restaurantsToShow = Array.isArray(restaurants) ? restaurants.filter((r) => !isCancelled(r)) : [];
  const activitiesToShow = Array.isArray(activities) ? activities.filter((a) => !isCancelled(a)) : [];
  const transportToShow = Array.isArray(transport) ? transport.filter((t) => !isCancelled(t)) : [];
  const shopsToShow = Array.isArray(shops) ? shops.filter((s) => !isCancelled(s)) : [];
  return (
    <Accordion type="single" collapsible defaultValue={dateValue} className="w-full">
      <AccordionItem value={dateValue}>
        <AccordionTrigger className="">
          <div className="items-start justify-start space-y-0 w-[10%]">
            <div className="text-base font-bold bg-primary-green text-white px-2 pb-3 pt-1 rounded-t-lg text-center">
              Day {day}
            </div>
            <div className="items-start text-xs text-zinc-800">
                {dateValue}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 font-sans shadow-md">
              <div className="mb-4 rounded-md border border-gray-200 p-4">
              <h3 className="mb-2 text-lg font-semibold text-[#287F71]">
                Hotel
              </h3>
              {hotelToShow ? (
                <div>
                  <h4 className="text-base font-medium text-gray-800">
                    {hotelToShow.hotel.name}
                  </h4>
                  <p className="text-gray-600">
                    Check-in: {formatDateToWeekdayMonth(hotelToShow.voucherLines[0]?.checkInDate ?? "")}
                  </p>
                  <p className="text-gray-600">
                    Check-out: {formatDateToWeekdayMonth(hotelToShow.voucherLines[0]?.checkOutDate ?? "")}
                  </p>
                  <p className="text-gray-600">Remarks: {hotelToShow.voucherLines[0]?.remarks}</p>
                </div>
              ) : (
                <p className="text-gray-500">No hotel information for this day.</p>
              )}
            </div>

            <div className="mb-4 rounded-md border border-gray-200 p-4">
              <h3 className="mb-2 text-lg font-semibold text-[#287F71]">
                Restaurants
              </h3>
              {restaurantsToShow.length > 0 ? (
                restaurantsToShow.map((restaurant, index) => (
                  <div key={index} className="mb-2">
                    <h4 className="text-base font-medium text-gray-800">
                      {restaurant.restaurant.name}
                    </h4>
                    <p className="text-gray-600">
                      Date: {formatDateToWeekdayMonth(restaurant.voucherLines[0]?.date ?? "")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No restaurant information for this day.</p>
              )}
            </div>

            <div className="mb-4 rounded-md border border-gray-200 p-4">
              <h3 className="mb-2 text-lg font-semibold text-[#287F71]">
                Activities
              </h3>
              {activitiesToShow.length > 0 ? (
                activitiesToShow.map((activity, index) => (
                  <div key={index} className="mb-2">
                    <h4 className="text-base font-medium text-gray-800">{activity.vendor.name}</h4>
                    <p className="text-gray-600">Activity Date: {formatDateToWeekdayMonth(activity.voucher.date)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No activities planned for this day.</p>
              )}
            </div>

            <div className="mb-4 rounded-md border border-gray-200 p-4">
              <h3 className="mb-2 text-lg font-semibold text-[#287F71]">
                Transport
              </h3>
              {transportToShow.length > 0 ? (
                transportToShow.map((trans, index) => (
                  <div key={index} className="mb-2">
                    <h4 className="text-base font-medium text-gray-800">Driver: {trans.driver?.name ?? trans.guide?.name}</h4>
                    <p className="text-gray-600">Transport Date: {formatDateToWeekdayMonth(trans.voucher.startDate)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No transport arrangements for this day.</p>
              )}
            </div>

            {/* <div className="mb-4 rounded-md border border-gray-200 p-4">
              <h3 className="mb-2 text-lg font-semibold text-[#287F71]">
                Shops
              </h3>
              {shops.length > 0 ? (
                shops.map((shop, index) => (
                  <div key={index} className="mb-2">
                    <h4 className="text-base font-medium text-gray-800">
                      {shop.shop.name}
                    </h4>
                    <p className="text-gray-600">
                      Date: {formatDateToWeekdayMonth(shop.voucher.date)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No shopping planned for this day.
                </p>
              )}
            </div> */}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SummaryCard;
