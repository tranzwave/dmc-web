"use client";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { InsertHotel, InsertHotelRoom, InsertHotelStaff } from "~/server/db/schemaTypes";
import { CompleteHotel } from "~/server/db/queries/hotel";

const EditHotelSubmitView = ({
  originalHotel,
  general,
  rooms,
  staff,
  onSubmit,
  loading,
}: {
  originalHotel: CompleteHotel | null;
  general: InsertHotel & { city?: string };
  rooms: InsertHotelRoom[];
  staff: InsertHotelStaff[];
  onSubmit: () => void;
  loading: boolean;
}) => {
  return (
    <div>
      {/* General Section */}
      <div className="flex w-24 items-center justify-center rounded-t-xl bg-primary-green p-1 text-sm font-bold text-white">
        <div>General</div>
      </div>
      <div className="mb-2 rounded-lg border shadow-md">
        <table className="min-w-full text-xs">
          <tbody>
            <tr>
              <td className="w-1/2 border px-4 py-2 font-bold">Name:</td>
              <td className="w-1/2 border px-4 py-2">{general.name}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Stars</td>
              <td className="border px-4 py-2">{general.stars}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Email:</td>
              <td className="border px-4 py-2">{general.primaryEmail}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Contact Number:</td>
              <td className="border px-4 py-2">{general.primaryContactNumber}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Street Name:</td>
              <td className="border px-4 py-2">{general.streetName}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">City:</td>
              <td className="border px-4 py-2">{general.city}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Province:</td>
              <td className="border px-4 py-2">{general.province}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Rooms Section */}
      <div className="flex w-24 items-center justify-center rounded-t-xl bg-primary-green p-1 text-sm font-bold text-white">
        <div>Rooms</div>
      </div>
      <div className="mb-2 rounded-lg border shadow-md">
        <table className="min-w-full text-xs">
          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room, index) => (
                <div key={index}>
                  <tr>
                    <th
                      className="bg-secondary-green px-4 py-2 text-sm font-bold text-primary-green"
                      colSpan={2}
                    >
                      Room {index + 1}
                    </th>
                  </tr>
                  <tr className="grid-cols-2">
                    <td className="w-1/2 border px-4 py-2 font-bold">
                      Room Type:
                    </td>
                    <td className="w-1/2 border px-4 py-2">{room.roomType}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-bold">Room Name:</td>
                    <td className="border px-4 py-2">{room.typeName}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-bold">Amenities</td>
                    <td className="border px-4 py-2">{room.amenities}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-bold">Count</td>
                    <td className="border px-4 py-2">{room.count}</td>
                  </tr>

                  <tr>
                    <td className="border px-4 py-2 font-bold">Bed Count</td>
                    <td className="border px-4 py-2">{room.bedCount}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-bold">Floor</td>
                    <td className="border px-4 py-2">{room.floor}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-bold">Comments</td>
                    <td className="border px-4 py-2">
                      {room.additionalComments}
                    </td>
                  </tr>
                </div>
              ))
            ) : (
              <tr>
                <td className="border px-4 py-2" colSpan={2}>
                  No rooms added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Staff Section */}
      <div className="flex w-24 items-center justify-center rounded-t-xl bg-primary-green p-1 text-sm font-bold text-white">
        <div>Staff</div>
      </div>
      <div className="mb-2 rounded-lg border shadow-md">
        <table className="min-w-full text-xs">
          <tbody>
            {staff.length > 0 ? (
              staff.map((s, index) => (
                <div key={index}>
                  <tr>
                    <th
                      className="bg-secondary-green px-4 py-2 text-sm font-bold text-primary-green"
                      colSpan={2}
                    >
                      Staff Member {index + 1}
                    </th>
                  </tr>
                  <tr>
                    <td className="w-1/2 border px-4 py-2 font-bold">Name:</td>
                    <td className="w-1/2 border px-4 py-2">{s.name}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-bold">
                      Contact Number:
                    </td>
                    <td className="border px-4 py-2">{s.contactNumber}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-bold">Email:</td>
                    <td className="border px-4 py-2">{s.email}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-bold">Occupation:</td>
                    <td className="border px-4 py-2">{s.occupation}</td>
                  </tr>
                </div>
              ))
            ) : (
              <tr>
                <td className="border px-4 py-2" colSpan={2}>
                  No staff members added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button variant={"primaryGreen"} onClick={onSubmit} disabled={loading}>
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <div>Submit Now</div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditHotelSubmitView;
