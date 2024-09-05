"use client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAddHotel } from "~/app/dashboard/hotels/add/context";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { insertHotel } from "~/server/db/queries/hotel";

const AddHotelSubmitView = () => {
  const { hotelGeneral, restaurants, hotelRooms, hotelStaff } = useAddHotel();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addHotel = async () => {
    console.log({
      hotelGeneral,
      restaurants,
      hotelRooms,
      hotelStaff,
    });

    try {
      const response = await insertHotel([
        {
          hotel: hotelGeneral,
          hotelRooms: hotelRooms,
          hotelStaffs: hotelStaff,
        },
      ]);

      if (!response) {
        throw new Error(`Error:Adding hotel`);
      }

      console.log("Success:", response);

      setLoading(false);
      // Handle successful response (e.g., show a success message)
      toast({
        title: "Success",
        description: "Hotel added successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error:", error);
      setLoading(false);
      toast({
        title: "Uh Oh!",
        description: "Error while adding the hotel",
      });
    } finally {
      setLoading(false);
    }
  };

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
              <td className="w-1/2 border px-4 py-2">{hotelGeneral.name}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Stars</td>
              <td className="border px-4 py-2">{hotelGeneral.stars}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Email:</td>
              <td className="border px-4 py-2">{hotelGeneral.primaryEmail}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Contact Number:</td>
              <td className="border px-4 py-2">
                {hotelGeneral.primaryContactNumber}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Street Name:</td>
              <td className="border px-4 py-2">{hotelGeneral.streetName}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">City:</td>
              <td className="border px-4 py-2">{hotelGeneral.cityId}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Province:</td>
              <td className="border px-4 py-2">{hotelGeneral.province}</td>
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
            {hotelRooms.length > 0 ? (
              hotelRooms.map((room, index) => (
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
                    <td className="w-1/2 border px-4 py-2">
                      {room.roomType}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-bold">
                      Room Name:
                    </td>
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
                    <td className="border px-4 py-2">{room.additionalComments}</td>
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
      {hotelStaff.length > 0 ? (
        hotelStaff.map((staff, index) => (
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
              <td className="w-1/2 border px-4 py-2">{staff.name}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Contact Number:</td>
              <td className="border px-4 py-2">{staff.contactNumber}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Email:</td>
              <td className="border px-4 py-2">{staff.email}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-bold">Occupation:</td>
              <td className="border px-4 py-2">{staff.occupation}</td>
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
        <Button variant={"primaryGreen"} onClick={addHotel}>
          {loading ? <Loader2 size={20} /> : <div>Submit Now</div>}
        </Button>
      </div>
    </div>
  );
};

export default AddHotelSubmitView;

{
  /*  */
}
