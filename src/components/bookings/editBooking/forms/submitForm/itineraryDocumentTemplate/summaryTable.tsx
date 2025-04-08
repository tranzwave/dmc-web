import { BookingSummary } from "~/app/dashboard/bookings/[id]/edit/context";


interface Props {
  summary: BookingSummary[];
}

export const BookingSummaryTable = ({ summary }: Props) => {
  return (
    <table className="w-full table-auto border border-gray-300 text-sm mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 px-4 py-2">Day</th>
          <th className="border border-gray-300 px-4 py-2">Hotel</th>
          <th className="border border-gray-300 px-4 py-2">Restaurants</th>
          <th className="border border-gray-300 px-4 py-2">Activities</th>
          <th className="border border-gray-300 px-4 py-2">Transport</th>
          <th className="border border-gray-300 px-4 py-2">Shops</th>
        </tr>
      </thead>
      <tbody>
        {summary.map((dayData) => (
          <tr key={dayData.day} className="align-top">
            {/* Day Column */}
            <td className="border border-gray-300 px-4 py-2 font-semibold whitespace-nowrap">
              Day {dayData.day}
              <br />
              <span className="text-xs font-normal">{dayData.date}</span>
            </td>

            {/* Hotel */}
            <td className="border border-gray-300 px-4 py-2">
              {dayData.hotel ? (
                <>
                  <div className="font-medium">{dayData.hotel.hotel.name}</div>
                  {/* <div>Check-in: {dayData.hotel}</div>
                  <div>Check-out: {dayData.hotel.checkOut}</div> */}
                  <div>Remarks: {dayData.hotel.voucher.specialNote || "None"}</div>
                </>
              ) : (
                <div>No hotel booked</div>
              )}
            </td>

            {/* Restaurants */}
            <td className="border border-gray-300 px-4 py-2">
              {dayData.restaurants.length > 0 ? (
                dayData.restaurants.map((rest, i) => (
                  <div key={i} className="mb-2">
                    <div className="font-medium">{rest.restaurant.name}</div>
                    {/* <div>Date: {rest.date}</div> */}
                    <div className="font-medium">{rest.voucherLines.map(
                        (line, index) => (
                            <div key={index} className="whitespace-nowrap">
                            {`${line.date} - ${line.time} - ${line.mealType}`}
                            </div>
                        ),
                    )}</div>

                  </div>
                ))
              ) : (
                <div>No restaurant plans</div>
              )}
            </td>

            {/* Activities */}
            <td className="border border-gray-300 px-4 py-2">
              {dayData.activities.length > 0 ? (
                dayData.activities.map((act, i) => (
                  <div key={i} className="mb-2">
                    <div className="font-medium">{act.vendor.name}</div>
                    <div>{act.voucher.activityName}</div>
                  </div>
                ))
              ) : (
                <div>No activities planned</div>
              )}
            </td>

            {/* Transport */}
            <td className="border border-gray-300 px-4 py-2">
              {dayData.transport.length > 0 ? (
                dayData.transport.map((t, i) => (
                  <div key={i} className="mb-2">
                    {t.driver && <div>Driver: {t.driver.name}</div>}
                    {t.guide && <div>Guide: {t.guide.name}</div>}
                    {/* <div>Date: {t.date}</div> */}
                  </div>
                ))
              ) : (
                <div>No transport info</div>
              )}
            </td>

            {/* Shops */}
            <td className="border border-gray-300 px-4 py-2">
              {dayData.shops.length > 0 ? (
                dayData.shops.map((s, i) => (
                  <div key={i} className="mb-2">
                    <div className="font-medium">{s.shop.name}</div>
                    {/* <div>Date: {s.}</div> */}
                  </div>
                ))
              ) : (
                <div>No shopping planned</div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
